// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';

interface ISafe {
    event ProxyCreation(IProxy proxy);

    function createProxyWithNonce(
        address _mastercopy,
        bytes memory initializer,
        uint256 saltNonce
    ) external returns (IProxy proxy);
}

interface IProxy {
    function masterCopy() external view returns (address);
}

contract AIProtector {
    using ByteHasher for bytes;

    IWorldID internal immutable worldId;
    uint256 internal immutable externalNullifier;
    uint256 internal immutable groupId = 1;

    mapping(address => bool) public isVerified;

    constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function verify(uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        isVerified[msg.sender] = true;
    }

    function create(
        address[] memory owners,
        address _safeAddress,
        address _mastercopy,
        bytes memory initializer,
        uint256 saltNonce
    ) public {
        require(isVerified[msg.sender], 'Creator needs to be verified too');
        for (uint256 i = 0; i < owners.length; i++) {
            require(isVerified[owners[i]], 'Address not verified');
        }
        ISafe(_safeAddress).createProxyWithNonce(_mastercopy, initializer, saltNonce);
    }

    function isUserVerified(address user) public view returns (bool) {
        return isVerified[user];
    }
}
