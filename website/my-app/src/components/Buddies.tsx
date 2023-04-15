import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { PROTECTOR } from "./app";
import ABI from "../utils/ABI";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useSigner,
} from "wagmi";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { SafeVersion } from "@safe-global/safe-core-sdk-types";
import { BigNumber, ethers } from "ethers";
import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { getSafeContractDeployment } from "@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts";

export interface IVaults {
  address: string;
  owners?: string[];
  id: string;
}
const safeVersion: SafeVersion = "1.3.0";
const POLYGON_PROXY = "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2";

export default function ({
  data,
  update,
}: {
  data: IVaults;
  update: () => void;
}) {
  const { data: signer } = useSigner();

  const [creatingSafe, setCreatingSafe] = React.useState(false);

  const { address } = useAccount();
  const toast = useToast();
  const ownersList = data.owners
    ? [data.address, ...data.owners]
    : [data.address];
  const contracts = ownersList.map((add) => ({
    address: PROTECTOR as `0x${string}`,
    abi: ABI,
    functionName: "isUserVerified",
    args: [add],
  }));

  const { data: allVerified, isLoading } = useContractReads({
    contracts,
  });
  const isOwner = address === data.address;
  const allAreVerified = allVerified ? allVerified.indexOf(false) < 0 : false;

  const createSafe = async () => {
    console.log("createSafe", signer);
    setCreatingSafe(true);
    if (signer) {
      try {
        const ethAdapterOwner1 = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });
        const safeFactory = await SafeFactory.create({
          ethAdapter: ethAdapterOwner1,
        });
        const owners = ownersList;
        const threshold = owners.length > 1 ? owners.length - 1 : owners.length;
        const safeAccountConfig = {
          owners,
          threshold,
        };
        const initializer = await safeFactory["encodeSetupCallData"](
          safeAccountConfig
        );
        const saltNonce = (
          Date.now() * 1000 +
          Math.floor(Math.random() * 1000)
        ).toString();
        const chainId = await signer.getChainId();
        const singletonDeployment = getSafeContractDeployment(
          safeVersion,
          chainId
        );
        const safeContract = ethAdapterOwner1.getSafeContract({
          safeVersion,
          chainId,
          singletonDeployment,
        });
        const safeContractAddress = safeContract.getAddress();
        console.log("initializer", initializer);
        console.log("saltNonce", saltNonce);
        console.log("safeMaster", safeContractAddress);
        console.log("owners", owners);
        const config = await prepareWriteContract({
          address: PROTECTOR,
          abi: ABI,
          functionName: "create",
          args: [
            owners,
            POLYGON_PROXY,
            safeContractAddress,
            initializer,
            saltNonce,
          ],
          overrides: {
            gasLimit: BigNumber.from(1000000),
          },
        });
        const { hash } = await writeContract(config);
        setCreatingSafe(false);
        toast({
          title: "You created a fault",
          description: `Checkout: https://www.polygonscan.com/tx/${hash}`,
          status: "info",
          duration: 9000,
          isClosable: true,
        });
        console.log("CREATE_SAFE_HASH", hash);
      } catch (e) {
        console.log("ERROR", e);
        setCreatingSafe(false);
      }
    }
  };

  const onAdd = async (thisAddress: string) => {
    if (thisAddress.length === 0) {
      return;
    }
    if (thisAddress === address) {
      toast({
        title: "Sorry buddy",
        description: "You can not add yourself",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (data.owners && data.owners.indexOf(thisAddress) > -1) {
      toast({
        title: "Sorry buddy",
        description: "This address is already added",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const others = data?.owners || [];
    await updateDoc(doc(db, "vaults", data.id), {
      owners: [...others, thisAddress],
    });
    toast({
      title: `Updated Doc: ${data.id}`,
      description: `Added User: ${thisAddress}`,
      status: "info",
      duration: 9000,
      isClosable: true,
    });
    update();
  };

  if (!data) {
    return <Spinner />;
  }

  return (
    <Flex
      border="2px solid white"
      flexDir={"column"}
      alignItems={"center"}
      p={6}
      m={3}
      borderRadius={8}
      bg="rgba(0,0,0,0.3)"
      backdropFilter="blur(5px)"
    >
      <Flex>
        <Heading fontSize={16}>My Buddies</Heading>
        {isOwner ? (
          <Badge mx={2}>owner</Badge>
        ) : (
          <Badge mx={2} colorScheme="purple">
            buddy
          </Badge>
        )}
      </Flex>
      <Text fontSize={12} opacity={0.5}>
        ({data.id})
      </Text>
      <Flex
        overflowY={"scroll"}
        justifyContent={"center"}
        flexDir={"column"}
        my={2}
      >
        <Buddy
          address={data.address}
          isLoading={isLoading}
          isVerified={allVerified ? allVerified[0] : false}
        />
        {data.owners &&
          data.owners.map((buddy: string, n) => (
            <Buddy
              isVerified={allVerified ? allVerified[n + 1] : false}
              isLoading={isLoading}
              address={buddy}
              key={buddy}
            />
          ))}
        {(!data.owners || data.owners.length < 3) &&
          address === data.address && <AddNew my={2} onClick={onAdd} />}
      </Flex>

      {allAreVerified && isOwner && (
        <Button
          isLoading={creatingSafe}
          loadingText="Create SAFE..."
          onClick={createSafe}
          variant={"prime"}
          my={2}
          w="100%"
        >
          Create SAFE
        </Button>
      )}
    </Flex>
  );
}

const Buddy = ({ address, isLoading, isVerified }: any) => {
  return (
    <Flex>
      <Box mx={1}>{address}</Box>
      <Box mx={1}>
        {isLoading ? <Spinner /> : isVerified ? <CheckIcon /> : <CloseIcon />}
      </Box>
    </Flex>
  );
};

const AddNew = ({ onClick }: any) => {
  const [address, setAddress] = React.useState("");
  return (
    <Flex flexDir={"column"}>
      <Input
        onChange={(e) => setAddress(e.target.value)}
        focusBorderColor="lime"
        placeholder="Your buddies address"
      />

      <Button variant={"secondary"} onClick={() => onClick(address)}>
        Add
      </Button>
    </Flex>
  );
};
