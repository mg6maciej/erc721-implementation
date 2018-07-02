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

    it("Alice owns tokens after minting multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        const ownerOfZero = await this.erc721.ownerOf(0);
        const ownerOfOne = await this.erc721.ownerOf(1);
        assert.strictEqual(ownerOfZero, alice);
        assert.strictEqual(ownerOfOne, alice);
    });

    it("Total supply is increased after minting multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        const supply = await this.erc721.totalSupply();
        assert.strictEqual(supply.toNumber(), 2);
    });

    it("Alice has increased balance after minting multiple two times", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.mintMultiple(alice, 3);
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 5);
    });
});
