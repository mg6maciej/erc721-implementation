pragma solidity ^0.4.24;

import "../contracts/ERC721Burnable.sol";

contract TestERC721Burnable is ERC721Burnable {

    function exists(uint tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to) external {
        _mint(to);
    }

    function mintMultiple(address to, uint amount) external {
        _mintMultiple(to, amount);
    }

    function burn(uint tokenId) external {
        _burn(tokenId);
    }
}
