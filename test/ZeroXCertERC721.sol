pragma solidity ^0.4.24;

import "@0xcert/ethereum-erc721/contracts/tokens/NFTokenEnumerable.sol";

contract ZeroXCertERC721 is NFTokenEnumerable {

    uint private nextTokenId;

    function mint(address to) external {
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    function burn(uint tokenId) external {
        _burn(ownerOf(tokenId), tokenId);
    }
}
