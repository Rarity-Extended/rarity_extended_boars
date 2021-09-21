// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface rarity {
    function level(uint) external view returns (uint);
    function class(uint) external view returns (uint);
    function getApproved(uint) external view returns (address);
    function ownerOf(uint) external view returns (address);
}
