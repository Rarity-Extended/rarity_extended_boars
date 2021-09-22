// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./rERC20.sol";

contract Leather is rERC20 {
    constructor(address _rm, address _minter) rERC20("Leather", "Leather - (Loot)", _rm, _minter) {}
}

contract Meat is rERC20 {
    constructor(address _rm, address _minter) rERC20("Meat", "Meat - (Loot)", _rm, _minter) {}
}

contract Tusks is rERC20 {
    constructor(address _rm, address _minter) rERC20("Tusks", "Tusks - (Loot)", _rm, _minter) {}
}

contract Mushroom is rERC20 {
    constructor(address _rm, address _minter) rERC20("Mushroom", "Mushroom - (Loot)", _rm, _minter) {}
}

contract Berries is rERC20 {
    constructor(address _rm, address _minter) rERC20("Berries", "Berries - (Loot)", _rm, _minter) {}
}

contract Wood is rERC20 {
    constructor(address _rm, address _minter) rERC20("Wood", "Wood - (Loot)", _rm, _minter) {}
}
