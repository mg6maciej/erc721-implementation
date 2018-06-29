pragma solidity ^0.4.24;

contract InvalidTestERC721Receiver {

    function onERC721Received(address, address, uint, bytes) external pure returns (bytes4) {
        return 0xdeadbeef;
    }
}
