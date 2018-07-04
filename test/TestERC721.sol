pragma solidity ^0.4.24;

import "../contracts/ERC721.sol";

contract TestERC721 is ERC721 {

    function exists(uint tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to) external {
        _mint(to);
    }

    function mintMultiple(address to, uint amount) external {
        _mintMultiple(to, amount);
    }
}
