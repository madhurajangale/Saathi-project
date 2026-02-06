// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GroupPool.sol";

contract GroupPoolFactory {

    address[] public allPools;

    event PoolCreated(address poolAddress, address admin);

    function createGroupPool() external returns (address) {

        GroupPool newPool = new GroupPool();

        address poolAddress = address(newPool);

        allPools.push(poolAddress);

        emit PoolCreated(poolAddress, msg.sender);

        return poolAddress;
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
}
