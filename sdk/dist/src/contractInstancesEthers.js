"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeProxyFactoryContractInstanceAI = void 0;
const CustomGnosisSafeProxyFactorEthersContract_1 = __importDefault(require("./CustomGnosisSafeProxyFactorEthersContract"));
const ethers_1 = require("ethers");
const abi_1 = __importDefault(require("./abi"));
function getSafeProxyFactoryContractInstanceAI(aiProtectorAddress, signerOrProvider, contract) {
    const aIProtector = new ethers_1.ethers.Contract(aiProtectorAddress, abi_1.default, signerOrProvider);
    return new CustomGnosisSafeProxyFactorEthersContract_1.default(contract, aIProtector);
}
exports.getSafeProxyFactoryContractInstanceAI = getSafeProxyFactoryContractInstanceAI;
