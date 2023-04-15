// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';
import 'hardhat/console.sol';

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

contract AIProtectorLight {
    constructor() {}

    function extractOwnersFromInitializer(
        bytes memory initializer
    ) internal view returns (address[] memory) {
        (address[] memory _owners, , , , , , ) = abi.decode(
            initializer,
            (address[], uint256, address, bytes, address, uint256, address)
        );
        console.logBytes(abi.encodePacked(_owners));
        return _owners;
    }

    function create(
        address _safeAddress,
        address _mastercopy,
        bytes memory initializer,
        uint256 saltNonce
    ) public {
        address[] memory owners = extractOwnersFromInitializer(initializer);

        // for (uint256 i = 0; i < owners.length; i++) {
        //     require(isVerified[owners[i]], 'Address not verified');
        // }

        ISafe(_safeAddress).createProxyWithNonce(_mastercopy, initializer, saltNonce);
    }
}
