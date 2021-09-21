// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./rERC20.sol";

contract Mushroom is rERC20 {
    constructor(address _rm, address _minter) rERC20("Mushroom", "Mushroom - (Loot)", _rm, _minter) {}
}
