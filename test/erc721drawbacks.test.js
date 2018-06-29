const ERC721 = artifacts.require("TestERC721.sol");

contract("ERC721", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

//    it("Can only mint 256 tokens", async () => {
//        await Promise.all(Array.from(Array(256), () => this.erc721.mint(alice)));
//        await expectThrows(this.erc721.mint(alice));
//    });
});

async function expectThrows(promise) {
    try {
        await promise;
        assert.fail();
    } catch (error) {
        if (error.name === "AssertionError") throw error;
    }
}
