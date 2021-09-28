// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface ISkills {
    function get_skills(uint256 _summoner)
        external
        view
        returns (uint8[36] memory);
}
