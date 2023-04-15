import {
  EthersAdapter,
  EthersAdapterConfig,
  GnosisSafeProxyFactoryEthersContract,
} from "@safe-global/protocol-kit";
import { GetContractProps } from "@safe-global/safe-core-sdk-types";
import { getSafeProxyFactoryContractInstanceAI } from "./contractInstancesEthers";
import { Signer } from "@ethersproject/abstract-signer";
import { Provider } from "@ethersproject/providers";

interface EthersAdapterConfigAI extends EthersAdapterConfig {
  aiProtectorAddress: string;
}

class EthersAdapterAIProtector extends EthersAdapter {
  aiProtectorAddress: string;
  providerLocal: Provider;
  signerLocal?: Signer;
  constructor({
    ethers,
    signerOrProvider,
    aiProtectorAddress,
  }: EthersAdapterConfigAI) {
    if (!ethers) {
      throw new Error("ethers property missing from options");
    }
    const isSigner = typeof signerOrProvider.getGasPrice === "function";
    console.log("isSigner", isSigner, signerOrProvider);
    super({
      ethers,
      signerOrProvider,
    });

    if (isSigner) {
      const signer = signerOrProvider as Signer;
      if (!signer.provider) {
        throw new Error("Signer must be connected to a provider");
      }
      this.providerLocal = signer.provider;
      this.signerLocal = signer;
    } else {
      this.providerLocal = signerOrProvider as Provider;
    }
    console.log(this.providerLocal, this.signerLocal);
    this.aiProtectorAddress = aiProtectorAddress;
  }

  async getChainId(): Promise<number> {
    if (this.signerLocal) {
      const network = await this.signerLocal.getChainId();
      return network;
    } else {
      console.log("run super getChainId");
      return super.getChainId();
    }
  }

  getSafeProxyFactoryContract({
    safeVersion,
    chainId,
    singletonDeployment,
    customContractAddress,
  }: GetContractProps): GnosisSafeProxyFactoryEthersContract {
    // Overwrite the function implementation here

    const result = super.getSafeProxyFactoryContract({
      safeVersion,
      chainId,
      singletonDeployment,
      customContractAddress,
    });

    const contract = result.contract;
    if (!contract) {
      throw new Error("Contract is undefined");
    }
    const signerOrProvider = this.signerLocal || this.providerLocal;

    return getSafeProxyFactoryContractInstanceAI(
      this.aiProtectorAddress,
      signerOrProvider,
      contract
    );
  }
}

export default EthersAdapterAIProtector;
