const ERC721 = artifacts.require("TestERC721Burnable.sol");

contract("ERC721Burnable", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Alice has nonzero balance after minting multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 2);
    });
});
