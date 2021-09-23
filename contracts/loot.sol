// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./rERC20.sol";

contract Leather is rERC20 {
    constructor(address _rm) rERC20("Leather", "Leather - (Loot)", _rm) {}
}

contract Meat is rERC20 {
    constructor(address _rm) rERC20("Meat", "Meat - (Loot)", _rm) {}
}

contract Tusks is rERC20 {
    constructor(address _rm) rERC20("Tusks", "Tusks - (Loot)", _rm) {}
}

contract Mushroom is rERC20 {
    constructor(address _rm) rERC20("Mushroom", "Mushroom - (Loot)", _rm) {}
}

contract Berries is rERC20 {
    constructor(address _rm) rERC20("Berries", "Berries - (Loot)", _rm) {}
}

contract Wood is rERC20 {
    constructor(address _rm) rERC20("Wood", "Wood - (Loot)", _rm) {}
}
