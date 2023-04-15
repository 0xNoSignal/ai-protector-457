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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_kit_1 = require("@safe-global/protocol-kit");
const safeDeploymentContracts_1 = require("@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts");
const ethers_1 = require("ethers");
const abi_1 = __importDefault(require("./abi"));
class AIProtecotrSafeCreator {
    constructor(signer, aiProtectorAddress, proxyAddress) {
        this.signer = signer;
        this.aiProtectorAddress = aiProtectorAddress;
        this.proxyAddress = proxyAddress;
        this.ethAdapter = new protocol_kit_1.EthersAdapter({
            ethers: ethers_1.ethers,
            signerOrProvider: signer,
        });
    }
    createSafe(_owners, threshold) {
        return __awaiter(this, void 0, void 0, function* () {
            const signerAddress = yield this.signer.getAddress();
            const owners = [...new Set([signerAddress, ..._owners])];
            const safeFactory = yield protocol_kit_1.SafeFactory.create({
                ethAdapter: this.ethAdapter,
            });
            const safeAccountConfig = {
                owners,
                threshold,
            };
            const initializer = yield safeFactory["encodeSetupCallData"](safeAccountConfig);
            const saltNonce = (Date.now() * 1000 +
                Math.floor(Math.random() * 1000)).toString();
            const safeVersion = "1.3.0";
            const chainId = yield this.signer.getChainId();
            const singletonDeployment = (0, safeDeploymentContracts_1.getSafeContractDeployment)(safeVersion, chainId);
            const safeContract = yield this.ethAdapter.getSafeContract({
                safeVersion,
                chainId,
                singletonDeployment,
            });
            const aIProtectorContract = new ethers_1.ethers.Contract(this.aiProtectorAddress, abi_1.default, this.signer);
            const txn = yield aIProtectorContract.create(owners, this.proxyAddress, yield safeContract.getAddress(), initializer, saltNonce, { gasLimit: 1000000 });
            return txn;
        });
    }
}
exports.default = AIProtecotrSafeCreator;
