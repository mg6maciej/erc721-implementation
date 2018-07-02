pragma solidity ^0.4.24;

import "./ERC165.sol";
import "./ERC721Receiver.sol";

contract ERC721 is ERC165 {

    event Transfer(address indexed from, address indexed to, uint indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool value);

    mapping (address => uint) private ownerToTokens;
    mapping (uint => address) private tokenToOwner;
    mapping (uint => address) private tokenToApproved;
    mapping (address => mapping (address => bool)) private ownerToApprovedOperators;

    uint public totalSupply;

    constructor() public {
        supportedInterfaces[0x80ac58cd] = true;
        supportedInterfaces[0x780e9d63] = true;
    }

    function balanceOf(address owner) external view returns (uint) {
        uint count = 0;
        uint tokens = ownerToTokens[owner];
        while (tokens != 0) {
            tokens &= tokens - 1;
            count++;
        }
        return count;
    }

    function ownerOf(uint tokenId) external view returns (address) {
        address owner = tokenToOwner[tokenId];
        require(owner != 0);
        return owner;
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        uint tokens = ownerToTokens[owner];
        while (index > 0) {
            tokens &= tokens - 1;
            index--;
        }
        require(tokens != 0);
        tokens &= -tokens;
        uint tokenId = 255;
        if (tokens & 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF != 0) { tokenId -= 128; }
        if (tokens & 0x0000000000000000FFFFFFFFFFFFFFFF0000000000000000FFFFFFFFFFFFFFFF != 0) { tokenId -= 64; }
        if (tokens & 0x00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF != 0) { tokenId -= 32; }
        if (tokens & 0x0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF != 0) { tokenId -= 16; }
        if (tokens & 0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF != 0) { tokenId -= 8; }
        if (tokens & 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F != 0) { tokenId -= 4; }
        if (tokens & 0x3333333333333333333333333333333333333333333333333333333333333333 != 0) { tokenId -= 2; }
        if (tokens & 0x5555555555555555555555555555555555555555555555555555555555555555 != 0) { tokenId -= 1; }
        return tokenId;
    }

    function tokenByIndex(uint index) external view returns (uint) {
        require(index < totalSupply);
        return index;
    }

    function transferFrom(address from, address to, uint tokenId) public {
        require(to != 0);
        address owner = tokenToOwner[tokenId];
        address approved = tokenToApproved[tokenId];
        require(from == owner);
        require(msg.sender == owner || msg.sender == approved || ownerToApprovedOperators[owner][msg.sender]);
        ownerToTokens[from] &= ~(1 << tokenId);
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
        if (approved != 0) {
            delete tokenToApproved[tokenId];
        }
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint tokenId, bytes data) public {
        transferFrom(from, to, tokenId);
        uint size;
        assembly { size := extcodesize(to) }
        if (size > 0) {
            bytes4 magic = ERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data);
            require(magic == 0x150b7a02);
        }
    }

    function safeTransferFrom(address from, address to, uint tokenId) external {
        safeTransferFrom(from, to, tokenId, "");
    }

    function approve(address approved, uint tokenId) external {
        address owner = tokenToOwner[tokenId];
        require(msg.sender == owner || ownerToApprovedOperators[owner][msg.sender]);
        require(approved != owner);
        tokenToApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }

    function setApprovalForAll(address operator, bool value) external {
        require(msg.sender != operator);
        ownerToApprovedOperators[msg.sender][operator] = value;
        emit ApprovalForAll(msg.sender, operator, value);
    }

    function getApproved(uint tokenId) external view returns (address) {
        return tokenToApproved[tokenId];
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return ownerToApprovedOperators[owner][operator];
    }

    function _mint(address to) internal {
        require(to != 0);
        uint tokenId = totalSupply;
        require(tokenId < 256);
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
        totalSupply++;
        emit Transfer(0, to, tokenId);
    }

    function _mintMultiple(address to, uint amount) internal {
        require(to != 0);
        require(totalSupply + amount <= 256);
        ownerToTokens[to] |= ((1 << amount) - 1) << totalSupply;
        for (uint i = 0; i < 3; i++) {
            tokenToOwner[totalSupply + i] = to;
        }
        totalSupply += amount;
    }
}
