pragma solidity ^0.4.24;

contract InvalidTestERC721Receiver {

    function onERC721Received(address _operator, address _from, uint _tokenId, bytes _data) external returns (bytes4) {
        return 0xdeadbeef;
    }
}
