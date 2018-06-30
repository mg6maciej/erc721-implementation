pragma solidity ^0.4.24;

interface ERC721Receiver {

    function onERC721Received(address operator, address from, uint tokenId, bytes data) external returns (bytes4);
}
