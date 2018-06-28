pragma solidity ^0.4.24;

contract ERC721 {

    uint private balance;

    function balanceOf(address owner) public view returns (uint) {
        return balance;
    }

    function _mint(address owner) internal {
        balance += 1;
    }
}
