pragma solidity ^0.4.24;

contract ERC165 {

    mapping (bytes4 => bool) internal supportedInterfaces;

    constructor() public {
        supportedInterfaces[0x01ffc9a7] = true;
    }

    function supportsInterface(bytes4 id) external view returns (bool) {
        return supportedInterfaces[id];
    }
}
