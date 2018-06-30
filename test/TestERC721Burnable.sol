pragma solidity ^0.4.24;

import "../contracts/ERC721Burnable.sol";

contract TestERC721Burnable is ERC721Burnable {

    function mint(address to) external {
        _mint(to);
    }

    function burn(uint tokenId) external {
        _burn(tokenId);
    }
}
