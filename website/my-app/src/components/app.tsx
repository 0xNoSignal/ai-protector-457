import React, { useCallback, useEffect, useState } from "react";
("use client");
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useAccount, useContractRead, useNetwork, useSigner } from "wagmi";
import ABI from "../utils/ABI";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useToast } from "@chakra-ui/react";
import { BigNumber, utils } from "ethers";
import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import { SafeVersion } from "@safe-global/safe-core-sdk-types";
import { getSafeContractDeployment } from "@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts";
import { db } from "../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Buddies, { IVaults } from "./Buddies";

const IDKitWidget = dynamic(
  () => import("@worldcoin/idkit").then((mod) => mod.IDKitWidget),
  { ssr: false }
);

interface IWorldCoinFeedback {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  credential_type: string;
}

export const PROTECTOR = "0x0c79C72D2c22950650eb63Ce58F2BBe0d5a2303e";

export function App() {
  const toast = useToast();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [verificationData, setVerifcationData] =
    React.useState<IWorldCoinFeedback>();
  const [creatingVault, setCreatingVault] = React.useState(false);

  const { data: isVerified, isLoading: isLoadingVerified } = useContractRead({
    address: PROTECTOR,
    abi: ABI,
    functionName: "isUserVerified",
    args: [address],
  });
  const [data, setData] = useState<IVaults[]>([]);

  useEffect(() => {
    if (address) {
      update();
    }
  }, [address]);

  const createVaults = async () => {
    setCreatingVault(true);

    try {
      await addDoc(collection(db, "vaults"), {
        address: address,
      });
      update();
      setCreatingVault(false);
    } catch (e) {
      console.error("e", e);
      setCreatingVault(false);
    }
  };

  const update = useCallback(async () => {
    console.log("GO");
    const q = query(collection(db, "vaults"), where("address", "==", address));

    const querySnapshot = await getDocs(q);
    const list = [] as IVaults[];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      list.push({
        ...doc.data(),
        id: doc.id,
      } as IVaults);
    });
    const q2 = query(
      collection(db, "vaults"),
      where("owners", "array-contains", address)
    );

    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      list.push({
        ...doc.data(),
        id: doc.id,
      } as IVaults);
    });
    setData(list);
  }, [data]);

  useEffect(() => {
    (async () => {
      update();
    })();
  }, [address]);

  const isPoly = chain && chain.id === 137;
  console.log("data", isVerified, verificationData);

  const verifyWithSmartContract = async () => {
    console.log("verifyWithSmartContract");
    if (verificationData) {
      const config = await prepareWriteContract({
        address: PROTECTOR,
        abi: ABI,
        functionName: "verify",
        args: [
          verificationData.merkle_root,
          verificationData.nullifier_hash,
          verificationData &&
            utils.defaultAbiCoder.decode(
              ["uint256[8]"],
              verificationData.proof
            )[0],
        ],
      });
      const { hash } = await writeContract(config);

      toast({
        title: "Confirm you are a human",
        description: `Checkout: https://www.polygonscan.com/tx/${hash}`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      console.log("hash", hash);
    }
  };

  return (
    <div>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        w="100%"
        pos={"absolute"}
        top={0}
        left={0}
        p={"2% 4%"}
      >
        <Flex>
          {!isPoly && (
            <Box>
              Please switch to polygon:
              <Web3NetworkSwitch />
            </Box>
          )}
          <Box
            borderRadius={5}
            border={`2px solid ${isVerified ? "#00B460" : "red"}`}
            p={2}
          >
            isUserVerified:
            {isLoadingVerified ? (
              <Spinner />
            ) : (
              <Text
                color={isVerified ? "black" : "red"}
              >{`${isVerified}`}</Text>
            )}
          </Box>
        </Flex>

        <Web3Button />
      </Flex>

      {!isVerified && !isLoadingVerified && (
        <IDKitWidget
          action="create-safe"
          signal={address}
          onSuccess={(result: any) => {
            console.log("yolo", result);
            setVerifcationData(result);
          }}
          app_id="app_75d596ef02783a36908d8436127df8f1"
        >
          {({ open }) => <Button onClick={open}>Verify</Button>}
        </IDKitWidget>
      )}
      {!isVerified && verificationData && (
        <Button variant={"prime"} onClick={verifyWithSmartContract}>
          Verify with Smart Contract
        </Button>
      )}
      {data.length > 0 &&
        data.map((vault) => {
          return <Buddies data={vault} key={vault.id} update={update} />;
        })}
      <Box pos="absolute" right={10} bottom={10}>
        <Button
          isLoading={creatingVault}
          loadingText="Create Vault with buddies.."
          onClick={createVaults}
          variant={"secondary"}
        >
          Create Vault with buddies
        </Button>
      </Box>
    </div>
  );
}
