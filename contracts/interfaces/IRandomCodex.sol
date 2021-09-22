// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IRandomCodex {
    function dn(uint _summoner, uint _number) external view returns (uint);
}