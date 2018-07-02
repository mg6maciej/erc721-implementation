const { expectThrows } = require("./utils");

const ERC721 = artifacts.require("TestERC721.sol");
const ERC721Burnable = artifacts.require("TestERC721Burnable.sol");

contract("ERC721Drawbacks", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
        this.erc721burnable = await ERC721Burnable.new();
    });

    it("Can only mint 256 tokens", async () => {
        await this.erc721.mintMultiple(alice, 256);
        await expectThrows(this.erc721.mint(alice));
    });

    it("Can only mint 256 tokens using mint multiple", async () => {
        await this.erc721.mintMultiple(alice, 255);
        await expectThrows(this.erc721.mintMultiple(alice, 2));
    });

    it("Can only mint 256 burnable tokens", async () => {
        await this.erc721burnable.mintMultiple(alice, 256);
        await expectThrows(this.erc721burnable.mint(alice));
    });

    it("Can only mint 256 burnable tokens using mint multiple", async () => {
        await this.erc721burnable.mintMultiple(alice, 255);
        await expectThrows(this.erc721burnable.mintMultiple(alice, 2));
    });
});
