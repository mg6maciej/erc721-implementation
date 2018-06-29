pragma solidity ^0.4.24;

contract TestERC721Receiver {

    address public operator;
    address public from;
    uint public tokenId;
    bytes public data;

    function onERC721Received(address _operator, address _from, uint _tokenId, bytes _data) external returns (bytes4) {
        operator = _operator;
        from = _from;
        tokenId = _tokenId;
        data = _data;
        return 0;
    }
}
