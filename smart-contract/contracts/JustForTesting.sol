// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

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

contract JustForTesting is ISafe {
    uint256 public counter;

    constructor() {
        counter = 0;
    }

    function dummyFunction() external pure returns (string memory) {
        return 'This is a dummy function';
    }

    function createProxyWithNonce(
        address _mastercopy,
        bytes memory initializer,
        uint256 saltNonce
    ) external override returns (IProxy proxy) {
        require(_mastercopy != address(0), 'Invalid master copy address');
        require(initializer.length > 0, 'Initializer is empty');

        counter++;

        proxy = new Proxy(_mastercopy);
        emit ProxyCreation(proxy);
    }
}

contract Proxy is IProxy {
    address public override masterCopy;

    constructor(address _mastercopy) {
        masterCopy = _mastercopy;
    }
}
