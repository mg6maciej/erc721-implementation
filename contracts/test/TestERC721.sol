pragma solidity ^0.4.24;

import "../ERC721.sol";

contract TestERC721 is ERC721 {

    function mint(address owner) external {
        _mint(owner);
    }
}
