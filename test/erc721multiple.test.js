const { expectThrows } = require("./utils");

const ERC721 = artifacts.require("TestERC721.sol");

contract("ERC721", ([owner, alice, bob, charlie]) => {

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

    it("Alice has increased balance after minting multiple twice", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.mintMultiple(alice, 3);
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 5);
    });

    it("Total supply is increased after minting multiple twice", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.mintMultiple(alice, 3);
        const supply = await this.erc721.totalSupply();
        assert.strictEqual(supply.toNumber(), 5);
    });

    it("Throws when trying to mint multiple to address 0x0", async () => {
        await expectThrows(this.erc721.mintMultiple("0x" + "0".repeat(40), 2));
    });

    it("Alice owns tokens after minting multiple twice", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.mintMultiple(alice, 3);
        const owner = await this.erc721.ownerOf(4);
        assert.strictEqual(owner, alice);
    });

    it("Throws when getting owner of nonexistent token", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await expectThrows(this.erc721.ownerOf(2));
    });
});
