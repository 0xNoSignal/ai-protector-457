"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_kit_1 = require("@safe-global/protocol-kit");
const ethers_1 = require("ethers"); // Make sure to import the Contract type from ethers
class CustomGnosisSafeProxyFactorEthersContract extends protocol_kit_1.GnosisSafeProxyFactoryEthersContract {
    constructor(contract, customContract) {
        super(contract);
        this.customContract = customContract;
    }
    createProxy({ safeMasterCopyAddress, initializer, saltNonce, options, callback, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ethers_1.BigNumber.from(saltNonce).lt(0))
                throw new Error("saltNonce must be greater than or equal to 0");
            if (options && !options.gasLimit) {
                const gasLimit = yield this.customContract.estimateGas.create(this.contract.address, safeMasterCopyAddress, initializer, saltNonce, Object.assign({}, options));
                options.gasLimit = gasLimit.toNumber();
            }
            const proxyAddress = yield this.customContract
                .create(this.contract.address, safeMasterCopyAddress, initializer, saltNonce)
                .then((txResponse) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (callback) {
                    callback(txResponse.hash);
                }
                const txReceipt = yield txResponse.wait();
                const proxyCreationEvent = (_a = txReceipt === null || txReceipt === void 0 ? void 0 : txReceipt.events) === null || _a === void 0 ? void 0 : _a.find(({ event }) => event === "ProxyCreation");
                if (!proxyCreationEvent || !proxyCreationEvent.args) {
                    throw new Error("SafeProxy was not deployed correctly");
                }
                const proxyAddress = proxyCreationEvent.args[0];
                return proxyAddress;
            }));
            return proxyAddress;
        });
    }
}
exports.default = CustomGnosisSafeProxyFactorEthersContract;
