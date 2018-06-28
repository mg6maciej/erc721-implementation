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
        if (t == 1) {
            return 0;
        } else {
            return 1;
        }
    }

    function _mint(address owner) internal {
        tokens[owner] |= 1 << supply;
        supply++;
    }
}
