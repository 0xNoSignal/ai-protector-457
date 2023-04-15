import { EthersAdapter, EthersAdapterConfig, GnosisSafeProxyFactoryEthersContract } from "@safe-global/protocol-kit";
import { GetContractProps } from "@safe-global/safe-core-sdk-types";
import { Signer } from "@ethersproject/abstract-signer";
import { Provider } from "@ethersproject/providers";
interface EthersAdapterConfigAI extends EthersAdapterConfig {
    aiProtectorAddress: string;
}
declare class EthersAdapterAIProtector extends EthersAdapter {
    aiProtectorAddress: string;
    providerLocal: Provider;
    signerLocal?: Signer;
    constructor({ ethers, signerOrProvider, aiProtectorAddress, }: EthersAdapterConfigAI);
    getChainId(): Promise<number>;
    getSafeProxyFactoryContract({ safeVersion, chainId, singletonDeployment, customContractAddress, }: GetContractProps): GnosisSafeProxyFactoryEthersContract;
}
export default EthersAdapterAIProtector;
