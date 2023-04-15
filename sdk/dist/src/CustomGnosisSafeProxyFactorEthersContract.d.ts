import { GnosisSafeProxyFactoryEthersContract } from "@safe-global/protocol-kit";
import { CreateProxyProps } from "@safe-global/protocol-kit/dist/src/adapters/ethers";
import { Proxy_factory as ProxyFactory_V1_0_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.0.0/Proxy_factory";
import { Proxy_factory as ProxyFactory_V1_1_1 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.1.1/Proxy_factory";
import { Proxy_factory as ProxyFactory_V1_3_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.3.0/Proxy_factory";
import { Contract } from "ethers";
declare class CustomGnosisSafeProxyFactorEthersContract extends GnosisSafeProxyFactoryEthersContract {
    customContract: Contract;
    constructor(contract: ProxyFactory_V1_0_0 | ProxyFactory_V1_1_1 | ProxyFactory_V1_3_0, customContract: Contract);
    createProxy({ safeMasterCopyAddress, initializer, saltNonce, options, callback, }: CreateProxyProps): Promise<string>;
}
export default CustomGnosisSafeProxyFactorEthersContract;
