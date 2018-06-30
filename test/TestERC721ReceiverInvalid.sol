pragma solidity ^0.4.24;

contract TestERC721ReceiverInvalid {

    function onERC721Received(address, address, uint, bytes) external pure returns (bytes4) {
        return 0xdeadbeef;
    }
}
