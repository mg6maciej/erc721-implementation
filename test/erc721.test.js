const ERC721 = artifacts.require("TestERC721.sol");

contract("ERC721", ([owner, alice, bob]) => {

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

    it("Throws when Alice has no tokens", async () => {
        await expectThrows(this.erc721.tokenOfOwnerByIndex(alice, 0));
    });

    it("Alice has token number one", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        const tokenId = await this.erc721.tokenOfOwnerByIndex(alice, 1);
        assert.strictEqual(tokenId.toNumber(), 1);
    });

    it("Bob has token number one", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(bob);
        const tokenId = await this.erc721.tokenOfOwnerByIndex(bob, 0);
        assert.strictEqual(tokenId.toNumber(), 1);
    });

    it("Alice has token number two", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        const tokenId = await this.erc721.tokenOfOwnerByIndex(alice, 2);
        assert.strictEqual(tokenId.toNumber(), 2);
    });

    it("Total supply is zero initially", async () => {
        const supply = await this.erc721.totalSupply();
        assert.strictEqual(supply.toNumber(), 0);
    });

    it("Total supply is increased", async () => {
        await this.erc721.mint(alice);
        const supply = await this.erc721.totalSupply();
        assert.strictEqual(supply.toNumber(), 1);
    });

    it("The first token is zero", async () => {
        await this.erc721.mint(alice);
        const tokenId = await this.erc721.tokenByIndex(0);
        assert.strictEqual(tokenId.toNumber(), 0);
    });

    it("Throws when asking for nonexistent token", async () => {
        await expectThrows(this.erc721.tokenByIndex(0));
    });

    it("The second token is one", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        const tokenId = await this.erc721.tokenByIndex(1);
        assert.strictEqual(tokenId.toNumber(), 1);
    });

    it("Alice is owner of token zero", async () => {
        await this.erc721.mint(alice);
        const owner = await this.erc721.ownerOf(0);
        assert.strictEqual(owner, alice);
    });

    it("Throws when token does not exist", async () => {
        await expectThrows(this.erc721.ownerOf(0));
    });

    it("Alice has zero balance after transfer to Bob", async () => {
        await this.erc721.mint(alice);
        await this.erc721.transferFrom(alice, bob, 0, { from: alice });
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Bob has nonzero balance after transfer to him", async () => {
        await this.erc721.mint(alice);
        await this.erc721.transferFrom(alice, bob, 0, { from: alice });
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 1);
    });

    it("Bob is owner of token after transfer to him", async () => {
        await this.erc721.mint(alice);
        await this.erc721.transferFrom(alice, bob, 0, { from: alice });
        const owner = await this.erc721.ownerOf(0);
        assert.strictEqual(owner, bob);
    });
});

async function expectThrows(promise) {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        if (error.name === "AssertionError") throw error;
    }
}
