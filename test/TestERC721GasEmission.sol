pragma solidity ^0.4.24;

import "./TestERC721.sol";

contract TestERC721GasEmission is TestERC721 {

    event GasUsed(uint gas);

    function tokenOfOwnerByIndexGasUse(address owner, uint index) public {
        uint start = gasleft();
        super.tokenOfOwnerByIndex(owner, index);
        uint end = gasleft();
        emit GasUsed(start - end);
    }
}
