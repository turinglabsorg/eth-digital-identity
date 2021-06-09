// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DID {
    mapping(address => string) identities;

    constructor() {

    }

    function add(string memory identity) public {
        identities[msg.sender] = identity;
    }

    function eid() public view returns(string memory){
        return identities[msg.sender];
    }

}
