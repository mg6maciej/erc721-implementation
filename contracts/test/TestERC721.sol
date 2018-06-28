pragma solidity ^0.4.24;

import "../ERC721.sol";

contract TestERC721 is ERC721 {

    function mint() external {
        _mint(msg.sender, 1);
    }
}
