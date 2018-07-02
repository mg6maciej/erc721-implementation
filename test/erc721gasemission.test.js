const ERC721 = artifacts.require("TestERC721GasEmission.sol");

contract("ERC721GasEmission", ([owner, alice, bob, charlie]) => {

    beforeEach(async () => {
        this.erc721 = await ERC721.new();
    });

    it("Test gas use for tokenOfOwnerByIndex with 256 different owners", async () => {
        for (let i = 1; i <= 256; i++) {
            await this.erc721.mint("0x" + i.toString().padStart("0", 40));
        }
        let gasTotal = 0;
        let gasInner = 0;
        for (let i = 1; i <= 256; i++) {
            const { receipt } = await this.erc721.tokenOfOwnerByIndexGasUse("0x" + i.toString().padStart("0", 40), 0);
            gasTotal += receipt.gasUsed;
            gasInner += parseInt(receipt.logs[0].data);
        }
        console.log(gasTotal, gasInner, gasTotal - gasInner);
        // 6170176 278912 5891264
        // 6093760 202496 5891264
    });

    it("Test gas use for tokenOfOwnerByIndex with single owner", async () => {
        await this.erc721.mintMany(alice, 128)
        await this.erc721.mintMany(alice, 128)
        let gasTotal = 0;
        let gasInner = 0;
        for (let i = 0; i < 256; i++) {
            const { receipt } = await this.erc721.tokenOfOwnerByIndexGasUse(alice, i);
            gasTotal += receipt.gasUsed;
            gasInner += parseInt(receipt.logs[0].data);
        }
        console.log(gasTotal, gasInner, gasTotal - gasInner);
        // 9066432 2857472 6208960
        // 8990016 2781056 6208960
    });
});
