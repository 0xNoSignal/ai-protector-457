import { EthersAdapter, SafeFactory } from "@safe-global/protocol-kit";
import { getSafeContractDeployment } from "@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts";
import { SafeVersion } from "@safe-global/safe-core-sdk-types";
import { Signer, ethers } from "ethers";
import AI_PROTECTOR_ABI from "./abi";

class AIProtecotrSafeCreator {
  ethAdapter: EthersAdapter;
  constructor(
    public signer: Signer,
    public aiProtectorAddress: string,
    public proxyAddress: string
  ) {
    this.ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
  }

  async createSafe(_owners: string[], threshold: number) {
    const signerAddress = await this.signer.getAddress();
    const owners = [...new Set([signerAddress, ..._owners])];
    const safeFactory = await SafeFactory.create({
      ethAdapter: this.ethAdapter,
    });
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

    const safeVersion: SafeVersion = "1.3.0";
    const chainId = await this.signer.getChainId();
    const singletonDeployment = getSafeContractDeployment(safeVersion, chainId);
    const safeContract = await this.ethAdapter.getSafeContract({
      safeVersion,
      chainId,
      singletonDeployment,
    });

    const aIProtectorContract = new ethers.Contract(
      this.aiProtectorAddress,
      AI_PROTECTOR_ABI,
      this.signer
    );

    const txn = await aIProtectorContract.create(
      owners,
      this.proxyAddress,
      await safeContract.getAddress(),
      initializer,
      saltNonce,
      { gasLimit: 1000000 }
    );
    return txn;
  }
}

export default AIProtecotrSafeCreator;
