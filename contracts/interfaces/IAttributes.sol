// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface attributes {
    function character_created(uint) external view returns (bool);
    function ability_scores(uint) external view returns (uint32,uint32,uint32,uint32,uint32,uint32);
}