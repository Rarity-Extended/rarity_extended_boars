// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

abstract contract OnlyExtended {
    address public extended;

    constructor() {
        extended = msg.sender;
    }

    modifier onlyExtended() {
        require(msg.sender == extended, "!owner");
        _;
    }
}
