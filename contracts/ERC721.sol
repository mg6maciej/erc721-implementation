pragma solidity ^0.4.24;

contract ERC721 {

    mapping (address => uint) private ownerToTokens;
    mapping (uint => address) private tokenToOwner;
    bool private approved;

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

    function transferFrom(address from, address to, uint tokenId) external {
        address owner = tokenToOwner[tokenId];
        require(from == owner);
        require(msg.sender == owner || approved);
        ownerToTokens[from] &= ~(1 << tokenId);
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
    }

    function approve(address spender, uint tokenId) external {
        approved = true;
    }

    function _mint(address to) internal {
        ownerToTokens[to] |= 1 << totalSupply;
        tokenToOwner[totalSupply] = to;
        totalSupply++;
    }
}
