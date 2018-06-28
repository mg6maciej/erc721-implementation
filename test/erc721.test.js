const ERC721 = artifacts.require("TestERC721.sol");

contract('ERC721', ([alice]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Alice has zero balance", async () => {
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });
});
