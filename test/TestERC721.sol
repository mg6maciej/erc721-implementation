pragma solidity ^0.4.24;

import "../contracts/ERC721.sol";

contract TestERC721 is ERC721 {

    function mint(address to) external {
        _mint(to);
    }
}
