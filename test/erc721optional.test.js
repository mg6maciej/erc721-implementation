const ERC721 = artifacts.require("TestERC721.sol");

contract("ERC721", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Token zero does not exist initially", async () => {
        const exists = await this.erc721.exists(0);
        assert.strictEqual(exists, false);
    });

    it("Token zero exists after minting", async () => {
        await this.erc721.mint(alice);
        const exists = await this.erc721.exists(0);
        assert.strictEqual(exists, true);
    });
});
