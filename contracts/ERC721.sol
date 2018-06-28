pragma solidity ^0.4.24;

contract ERC721 {

    mapping (address => uint) private tokens;
    uint private supply;

    function balanceOf(address owner) public view returns (uint) {
        uint count;
        uint t = tokens[owner];
        while (t != 0) {
            t &= t - 1;
            count++;
        }
        return count;
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        uint t = tokens[owner];
        while (index > 0) {
            t &= t - 1;
            index--;
        }
        require(t != 0);
        uint8 id = 255;
        if (t & 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF == 0) { t >>= 128; } else { id -= 128; }
        if (t & 0x000000000000000000000000000000000000000000000000FFFFFFFFFFFFFFFF == 0) { t >>= 64; } else { id -= 64; }
        if (t & 0x00000000000000000000000000000000000000000000000000000000FFFFFFFF == 0) { t >>= 32; } else { id -= 32; }
        if (t & 0x000000000000000000000000000000000000000000000000000000000000FFFF == 0) { t >>= 16; } else { id -= 16; }
        if (t & 0x00000000000000000000000000000000000000000000000000000000000000FF == 0) { t >>= 8; } else { id -= 8; }
        if (t & 0x000000000000000000000000000000000000000000000000000000000000000F == 0) { t >>= 4; } else { id -= 4; }
        if (t & 0x0000000000000000000000000000000000000000000000000000000000000003 == 0) { t >>= 2; } else { id -= 2; }
        if (t & 0x0000000000000000000000000000000000000000000000000000000000000001 != 0) { id -= 1; }
        return id;
    }

    function _mint(address owner) internal {
        tokens[owner] |= 1 << supply;
        supply++;
    }
}
