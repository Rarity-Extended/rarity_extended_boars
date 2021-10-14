// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

abstract contract OnlyExtended {
    address public extended;
    address public pendingExtended;

    constructor() {
        extended = msg.sender;
    }

    modifier onlyExtended() {
        require(msg.sender == extended, "!owner");
        _;
    }
    modifier onlyPendingExtended() {
		require(msg.sender == pendingExtended, "!authorized");
		_;
	}

    /*******************************************************************************
	**	@notice
	**		Nominate a new address to use as Extended.
	**		The change does not go into effect immediately. This function sets a
	**		pending change, and the management address is not updated until
	**		the proposed Extended address has accepted the responsibility.
	**		This may only be called by the current Extended address.
	**	@param _extended The address requested to take over the role.
	*******************************************************************************/
    function setExtended(address _extended) public onlyExtended() {
		pendingExtended = _extended;
	}


	/*******************************************************************************
	**	@notice
	**		Once a new extended address has been proposed using setExtended(),
	**		this function may be called by the proposed address to accept the
	**		responsibility of taking over the role for this contract.
	**		This may only be called by the proposed Extended address.
	**	@dev
	**		setExtended() should be called by the existing extended address,
	**		prior to calling this function.
	*******************************************************************************/
    function acceptExtended() public onlyPendingExtended() {
		extended = msg.sender;
	}
    
}
