const ERC721 = artifacts.require("TestERC721.sol");

contract('ERC721', ([owner, alice, bob]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Alice has zero balance initially", async () => {
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Alice has nonzero balance after mint", async () => {
        await this.erc721.mint(alice);
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 1);
    });

    it("Alice's balance is increased after second mint", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 2);
    });

    it("Bob's balance stays at zero", async () => {
        await this.erc721.mint(alice);
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Alice has token number zero", async () => {
        await this.erc721.mint(alice);
        const tokenId = await this.erc721.tokenOfOwnerByIndex(alice, 0);
        assert.strictEqual(tokenId.toNumber(), 0);
    });
});
