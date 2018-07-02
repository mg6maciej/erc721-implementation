pragma solidity ^0.4.24;

import "../contracts/ERC721.sol";

contract TestERC721 is ERC721 {

    function mint(address to) external {
        _mint(to);
    }

    function mintMany(address to, uint amount) external {
        for (uint i = 0; i < amount; i++) {
            _mint(to);
        }
    }

    function mintMultiple(address to, uint amount) external {
        _mintMultiple(to, amount);
    }
}
