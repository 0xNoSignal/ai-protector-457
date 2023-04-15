import { Signer } from "@ethersproject/abstract-signer";
import { Provider } from "@ethersproject/providers";
import CustomGnosisSafeProxyFactorEthersContract from "./CustomGnosisSafeProxyFactorEthersContract";
import { ethers } from "ethers";
import AI_PROTECTOR_ABI from "./abi";
import { Proxy_factory as ProxyFactory_V1_0_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.0.0/Proxy_factory";
import { Proxy_factory as ProxyFactory_V1_1_1 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.1.1/Proxy_factory";
import { Proxy_factory as ProxyFactory_V1_3_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.3.0/Proxy_factory";

export function getSafeProxyFactoryContractInstanceAI(
  aiProtectorAddress: string,
  signerOrProvider: Signer | Provider,
  contract: ProxyFactory_V1_0_0 | ProxyFactory_V1_1_1 | ProxyFactory_V1_3_0
): any {
  const aIProtector = new ethers.Contract(
    aiProtectorAddress,
    AI_PROTECTOR_ABI,
    signerOrProvider
  );

  return new CustomGnosisSafeProxyFactorEthersContract(contract, aIProtector);
}
