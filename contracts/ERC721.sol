pragma solidity ^0.4.24;

contract ERC721 {

    mapping (address => uint) private balances;

    function balanceOf(address owner) public view returns (uint) {
        return balances[owner];
    }

    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        require(index < balances[owner]);
        return 0;
    }

    function _mint(address owner) internal {
        balances[owner] += 1;
    }
}
