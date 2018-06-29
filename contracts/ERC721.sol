pragma solidity ^0.4.24;

interface ERC721Receiver {

    function onERC721Received(address operator, address from, uint tokenId, bytes data) external returns (bytes4);
}

contract ERC721 {

    mapping (address => uint) private ownerToTokens;
    mapping (uint => address) private tokenToOwner;
    mapping (uint => address) private tokenToApproved;
    mapping (address => mapping (address => bool)) private ownerToApprovedOperators;

    uint public totalSupply;

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
        uint tokenId = 255;
        if (tokens & 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF == 0) { tokens >>= 128; } else { tokenId -= 128; }
        if (tokens & 0x000000000000000000000000000000000000000000000000FFFFFFFFFFFFFFFF == 0) { tokens >>= 64; } else { tokenId -= 64; }
        if (tokens & 0x00000000000000000000000000000000000000000000000000000000FFFFFFFF == 0) { tokens >>= 32; } else { tokenId -= 32; }
        if (tokens & 0x000000000000000000000000000000000000000000000000000000000000FFFF == 0) { tokens >>= 16; } else { tokenId -= 16; }
        if (tokens & 0x00000000000000000000000000000000000000000000000000000000000000FF == 0) { tokens >>= 8; } else { tokenId -= 8; }
        if (tokens & 0x000000000000000000000000000000000000000000000000000000000000000F == 0) { tokens >>= 4; } else { tokenId -= 4; }
        if (tokens & 0x0000000000000000000000000000000000000000000000000000000000000003 == 0) { tokens >>= 2; } else { tokenId -= 2; }
        if (tokens & 0x0000000000000000000000000000000000000000000000000000000000000001 != 0) { tokenId -= 1; }
        return tokenId;
    }

    function tokenByIndex(uint index) external view returns (uint) {
        require(index < totalSupply);
        return index;
    }

    function transferFrom(address from, address to, uint tokenId) public {
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
    }

    function safeTransferFrom(address from, address to, uint tokenId, bytes data) public {
        transferFrom(from, to, tokenId);
        uint size;
        assembly { size := extcodesize(to) }
        if (size > 0) {
            ERC721Receiver(to).onERC721Received(msg.sender, from, 0, data);
        }
    }

    function safeTransferFrom(address from, address to, uint tokenId) external {
        safeTransferFrom(from, to, tokenId, "");
    }

    function approve(address spender, uint tokenId) external {
        require(msg.sender == tokenToOwner[tokenId]);
        tokenToApproved[tokenId] = spender;
    }

    function setApprovalForAll(address operator, bool value) external {
        ownerToApprovedOperators[msg.sender][operator] = value;
    }

    function getApproved(uint tokenId) external view returns (address) {
        return tokenToApproved[tokenId];
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return ownerToApprovedOperators[owner][operator];
    }

    function _mint(address to) internal {
        require(totalSupply < 256);
        ownerToTokens[to] |= 1 << totalSupply;
        tokenToOwner[totalSupply] = to;
        totalSupply++;
    }
}
