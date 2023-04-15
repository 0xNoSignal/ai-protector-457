import { GnosisSafeProxyFactoryEthersContract } from "@safe-global/protocol-kit";
import { CreateProxyProps } from "@safe-global/protocol-kit/dist/src/adapters/ethers";
import { Proxy_factory as ProxyFactory_V1_0_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.0.0/Proxy_factory";
import { Proxy_factory as ProxyFactory_V1_1_1 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.1.1/Proxy_factory";

import { Proxy_factory as ProxyFactory_V1_3_0 } from "@safe-global/protocol-kit/dist/typechain/src/ethers-v5/v1.3.0/Proxy_factory";

import { BigNumber, Contract, Event } from "ethers"; // Make sure to import the Contract type from ethers

class CustomGnosisSafeProxyFactorEthersContract extends GnosisSafeProxyFactoryEthersContract {
  customContract: Contract;

  constructor(
    contract: ProxyFactory_V1_0_0 | ProxyFactory_V1_1_1 | ProxyFactory_V1_3_0,
    customContract: Contract
  ) {
    super(contract);
    this.customContract = customContract;
  }

  async createProxy({
    safeMasterCopyAddress,
    initializer,
    saltNonce,
    options,
    callback,
  }: CreateProxyProps): Promise<string> {
    if (BigNumber.from(saltNonce).lt(0))
      throw new Error("saltNonce must be greater than or equal to 0");
    if (options && !options.gasLimit) {
      const gasLimit = await this.customContract.estimateGas.create(
        this.contract.address,
        safeMasterCopyAddress,
        initializer,
        saltNonce,
        {
          ...options,
        }
      );
      options.gasLimit = gasLimit.toNumber();
    }
    const proxyAddress = await this.customContract
      .create(
        this.contract.address,
        safeMasterCopyAddress,
        initializer,
        saltNonce
      )
      .then(async (txResponse: any) => {
        if (callback) {
          callback(txResponse.hash);
        }
        const txReceipt = await txResponse.wait();
        const proxyCreationEvent = txReceipt?.events?.find(
          ({ event }: Event) => event === "ProxyCreation"
        );
        if (!proxyCreationEvent || !proxyCreationEvent.args) {
          throw new Error("SafeProxy was not deployed correctly");
        }
        const proxyAddress: string = proxyCreationEvent.args[0];
        return proxyAddress;
      });

    return proxyAddress;
  }
}

export default CustomGnosisSafeProxyFactorEthersContract;
