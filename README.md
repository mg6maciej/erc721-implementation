# erc721-implementation
If your project requires max 256 non-fungible tokens, this is the implementation you should use as the most gas efficient.

Note: This implementation does not contain code related to ERC721Metadata.
It's up to the user to add that to support explorers, exchanges and whatnot.
See [ExampleERC721Metadata.sol](https://github.com/mg6maciej/erc721-implementation/blob/master/test/ExampleERC721Metadata.sol).

If you really need an implementation that supports more NFTs,
like 257 or maybe even 496, I recommend one of these repositories:
* https://github.com/0xcert/ethereum-erc721
* https://github.com/OpenZeppelin/openzeppelin-solidity

And remember: scarcity is the key.
