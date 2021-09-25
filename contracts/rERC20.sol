// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./interfaces/IRarity.sol";
import "./interfaces/IAttributes.sol";

abstract contract rERC20 {

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint public totalSupply = 0;
    bool public init_minter = false;

    IRarity public rm;
    address public minter;

    constructor(string memory _name, string memory _symbol, address _rm){
        name = _name;
        symbol = _symbol;
        rm = IRarity(_rm);
    }

    function setMinter(address _minter) external {
        require(init_minter == false, "nope");
        init_minter = true;
        minter = _minter;
    }

    mapping(uint => mapping (uint => uint)) public allowance;
    mapping(uint => uint) public balanceOf;

    event Transfer(uint indexed from, uint indexed to, uint amount);
    event Approval(uint indexed from, uint indexed to, uint amount);

    function _isApprovedOrOwner(uint _summoner) internal view returns (bool) {
        return rm.getApproved(_summoner) == msg.sender || rm.ownerOf(_summoner) == msg.sender;
    }

    function mint(uint dst, uint amount) external {
        require(msg.sender == minter, "dont hack pls");
        totalSupply += amount;
        balanceOf[dst] += amount;
        emit Transfer(dst, dst, amount);
    }

    function approve(uint from, uint spender, uint amount) external returns (bool) {
        require(_isApprovedOrOwner(from));
        allowance[from][spender] = amount;

        emit Approval(from, spender, amount);
        return true;
    }

    function transfer(uint from, uint to, uint amount) external returns (bool) {
        require(_isApprovedOrOwner(from));
        _transferTokens(from, to, amount);
        return true;
    }

    function transferFrom(uint executor, uint from, uint to, uint amount) external returns (bool) {
        require(_isApprovedOrOwner(executor));
        uint spender = executor;
        uint spenderAllowance = allowance[from][spender];

        if (spender != from && spenderAllowance != type(uint).max) {
            uint newAllowance = spenderAllowance - amount;
            allowance[from][spender] = newAllowance;

            emit Approval(from, spender, newAllowance);
        }

        _transferTokens(from, to, amount);
        return true;
    }

    function _transferTokens(uint from, uint to, uint amount) internal {
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
    }
}