pragma solidity ^0.4.24;

import "../contracts/ERC721.sol";

contract ExampleERC721Metadata is ERC721 {

    string public constant name = "Example ERC721 Metadata";
    string public constant symbol = "E721M";

    constructor() public {
        supportedInterfaces[0x5b5e139f] = true;
    }

    function tokenURI(uint tokenId) external view returns (string) {
        require(_exists(tokenId));
        bytes memory uri = "https://exmaplemetadata.com/token/XXX.json";
        uri[34] = bytes1(48 + tokenId / 100);
        uri[35] = bytes1(48 + tokenId / 10 % 10);
        uri[36] = bytes1(48 + tokenId % 10);
        return string(uri);
    }
}
