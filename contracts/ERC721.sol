pragma solidity ^0.4.24;

import "./ERC165.sol";
import "./ERC721Receiver.sol";

contract ERC721 is ERC165 {

    event Transfer(address indexed from, address indexed to, uint indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool value);

    mapping (address => uint) private ownerToTokens;
    mapping (uint => address) private tokenToOwner;

    uint public totalSupply;
    mapping (uint => address) public getApproved;
    mapping (address => mapping (address => bool)) public isApprovedForAll;

    constructor() public {
        supportedInterfaces[0x80ac58cd] = true;
        supportedInterfaces[0x780e9d63] = true;
    }

    function balanceOf(address owner) external view returns (uint) {
        uint count = 0;
        uint tokens = ownerToTokens[owner];
        while (tokens != 0) {
            count++;
            tokens &= tokens - 1;
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
        address approved = getApproved[tokenId];
        require(from == owner);
        require(msg.sender == owner || msg.sender == approved || isApprovedForAll[owner][msg.sender]);
        ownerToTokens[from] &= ~(1 << tokenId);
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
        if (approved != 0) {
            delete getApproved[tokenId];
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

    function transferMultipleFrom(address from, address to, uint tokens) public {
        require(to != 0);
        require(ownerToTokens[from] & tokens == tokens);
        require(msg.sender == from || isApprovedForAll[from][msg.sender]);
        ownerToTokens[from] &= ~tokens;
        ownerToTokens[to] |= tokens;
        while (tokens != 0) {
            uint lsbs = tokens & -tokens;
            uint tokenId = 255;
            if (lsbs & 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF != 0) { tokenId -= 128; }
            if (lsbs & 0x0000000000000000FFFFFFFFFFFFFFFF0000000000000000FFFFFFFFFFFFFFFF != 0) { tokenId -= 64; }
            if (lsbs & 0x00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF != 0) { tokenId -= 32; }
            if (lsbs & 0x0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF != 0) { tokenId -= 16; }
            if (lsbs & 0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF != 0) { tokenId -= 8; }
            if (lsbs & 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F != 0) { tokenId -= 4; }
            if (lsbs & 0x3333333333333333333333333333333333333333333333333333333333333333 != 0) { tokenId -= 2; }
            if (lsbs & 0x5555555555555555555555555555555555555555555555555555555555555555 != 0) { tokenId -= 1; }
            tokenToOwner[tokenId] = to;
            if (getApproved[tokenId] != 0) {
                delete getApproved[tokenId];
            }
            emit Transfer(from, to, tokenId);
            tokens ^= lsbs;
        }
    }

    function approve(address approved, uint tokenId) external {
        address owner = tokenToOwner[tokenId];
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender]);
        require(approved != owner);
        getApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }

    function setApprovalForAll(address operator, bool value) external {
        require(msg.sender != operator);
        isApprovedForAll[msg.sender][operator] = value;
        emit ApprovalForAll(msg.sender, operator, value);
    }

    function _exists(uint tokenId) internal view returns (bool) {
        return tokenId < totalSupply;
    }

    function _mint(address to) internal {
        require(to != 0);
        uint tokenId = totalSupply;
        require(tokenId < 256);
        totalSupply++;
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
        emit Transfer(0, to, tokenId);
    }

    function _mintMultiple(address to, uint amount) internal {
        require(to != 0);
        uint firstTokenId = totalSupply;
        require(firstTokenId + amount <= 256);
        totalSupply += amount;
        ownerToTokens[to] |= ((1 << amount) - 1) << firstTokenId;
        for (uint i = 0; i < amount; i++) {
            tokenToOwner[firstTokenId + i] = to;
            emit Transfer(0, to, firstTokenId + i);
        }
    }
}
