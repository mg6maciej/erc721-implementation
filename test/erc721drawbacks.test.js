const ERC721 = artifacts.require("TestERC721.sol");

contract("ERC721", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Can only mint 256 tokens", async () => {
        await this.erc721.mintMany(alice, 128);
        await this.erc721.mintMany(alice, 128);
        await expectThrows(this.erc721.mint(alice));
    });
});

async function expectThrows(promise) {
    let resolvedWithoutError = false;
    try {
        await promise;
        resolvedWithoutError = true;
    } catch (error) {
        // ignore
    }
    if (resolvedWithoutError) {
        assert.fail();
    }
}
