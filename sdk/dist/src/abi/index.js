"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        inputs: [
            { internalType: "contract IWorldID", name: "_worldId", type: "address" },
            { internalType: "string", name: "_appId", type: "string" },
            { internalType: "string", name: "_actionId", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            { internalType: "address[]", name: "owners", type: "address[]" },
            { internalType: "address", name: "_safeAddress", type: "address" },
            { internalType: "address", name: "_mastercopy", type: "address" },
            { internalType: "bytes", name: "initializer", type: "bytes" },
            { internalType: "uint256", name: "saltNonce", type: "uint256" },
        ],
        name: "create",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "isUserVerified",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "isVerified",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "root", type: "uint256" },
            { internalType: "uint256", name: "nullifierHash", type: "uint256" },
            { internalType: "uint256[8]", name: "proof", type: "uint256[8]" },
        ],
        name: "verify",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
