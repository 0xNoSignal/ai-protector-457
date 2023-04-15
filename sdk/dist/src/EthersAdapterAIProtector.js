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
const contractInstancesEthers_1 = require("./contractInstancesEthers");
class EthersAdapterAIProtector extends protocol_kit_1.EthersAdapter {
    constructor({ ethers, signerOrProvider, aiProtectorAddress, }) {
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
            const signer = signerOrProvider;
            if (!signer.provider) {
                throw new Error("Signer must be connected to a provider");
            }
            this.providerLocal = signer.provider;
            this.signerLocal = signer;
        }
        else {
            this.providerLocal = signerOrProvider;
        }
        console.log(this.providerLocal, this.signerLocal);
        this.aiProtectorAddress = aiProtectorAddress;
    }
    getChainId() {
        const _super = Object.create(null, {
            getChainId: { get: () => super.getChainId }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.signerLocal) {
                const network = yield this.signerLocal.getChainId();
                return network;
            }
            else {
                console.log("run super getChainId");
                return _super.getChainId.call(this);
            }
        });
    }
    getSafeProxyFactoryContract({ safeVersion, chainId, singletonDeployment, customContractAddress, }) {
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
        return (0, contractInstancesEthers_1.getSafeProxyFactoryContractInstanceAI)(this.aiProtectorAddress, signerOrProvider, contract);
    }
}
exports.default = EthersAdapterAIProtector;
