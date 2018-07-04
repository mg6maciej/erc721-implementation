const { expectThrows } = require("./utils");

const keccak = require("js-sha3").keccak_256;

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

    it("Transfer events are emitted when minting multiple", async () => {
        const { receipt: { logs } } = await this.erc721.mintMultiple(alice, 2);
        assert.strictEqual(logs.length, 2);
        assert.strictEqual(logs[0].topics[0], "0x" + keccak("Transfer(address,address,uint256)"));
        assert.strictEqual(logs[0].topics[1].replace("0".repeat(24), ""), "0x" + "0".repeat(40));
        assert.strictEqual(logs[0].topics[2].replace("0".repeat(24), ""), alice);
        assert.strictEqual(parseInt(logs[0].topics[3]), 0);
        assert.strictEqual(logs[1].topics[0], "0x" + keccak("Transfer(address,address,uint256)"));
        assert.strictEqual(logs[1].topics[1].replace("0".repeat(24), ""), "0x" + "0".repeat(40));
        assert.strictEqual(logs[1].topics[2].replace("0".repeat(24), ""), alice);
        assert.strictEqual(parseInt(logs[1].topics[3]), 1);
    });

    it("Bob's balance is increased after Alice transfers multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 2);
    });

    it("Throws when trying to transfer multiple to address 0x0", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await expectThrows(this.erc721.transferMultipleFrom(alice, "0x0" + "0".repeat(40), 0x3, { from: alice }));
    });

    it("Throws when trying to transfer multiple nonexistent tokens", async () => {
        await expectThrows(this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice }));
    });

    it("Throws when trying to transfer multiple and not owning at least one token", async () => {
        await this.erc721.mint(alice);
        await expectThrows(this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice }));
    });

    it("Alice can transfer multiple subset of her tokens", async () => {
        await this.erc721.mintMultiple(alice, 3);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 2);
    });

    it("Alice's balance is zeroed when she transfers multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Alice's balance is decreased correctly when she transfers multiple", async () => {
        await this.erc721.mintMultiple(alice, 3);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 1);
    });

    it("Bob cannot transfer multiple from Alice to Charlie", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await expectThrows(this.erc721.transferMultipleFrom(alice, charlie, 0x3, { from: bob }));
    });

    it("Bob can transfer multiple from Alice to Charlie when approved for all", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.setApprovalForAll(bob, true, { from: alice });
        await this.erc721.transferMultipleFrom(alice, charlie, 0x3, { from: bob });
        const balance = await this.erc721.balanceOf(charlie);
        assert.strictEqual(balance.toNumber(), 2);
    });

    it("Bob's balance is increased correctly when Alice transfers multiple to him", async () => {
        await this.erc721.mintMultiple(alice, 3);
        await this.erc721.transferMultipleFrom(alice, bob, 0x7, { from: alice });
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 3);
    });

    it("Bob doesn't lose previously owned tokens when Alice transfers multiple to him", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.mint(bob);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const balance = await this.erc721.balanceOf(bob);
        assert.strictEqual(balance.toNumber(), 3);
    });

    it("Bob owns tokens after Alice transfers multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const ownerOfZero = await this.erc721.ownerOf(0);
        const ownerOfOne = await this.erc721.ownerOf(1);
        assert.strictEqual(ownerOfZero, bob);
        assert.strictEqual(ownerOfOne, bob);
    });

    it("Bob owns correct tokens after Alice transfers multiple", async () => {
        await this.erc721.mintMultiple(alice, 3);
        await this.erc721.transferMultipleFrom(alice, bob, 0x6, { from: alice });
        const ownerOfOne = await this.erc721.ownerOf(1);
        const ownerOfTwo = await this.erc721.ownerOf(2);
        assert.strictEqual(ownerOfOne, bob);
        assert.strictEqual(ownerOfTwo, bob);
    });

    it("Alice still owns some of her tokens after transferring multiple", async () => {
        await this.erc721.mintMultiple(alice, 3);
        await this.erc721.transferMultipleFrom(alice, bob, 0x2, { from: alice });
        const ownerOfZero = await this.erc721.ownerOf(0);
        const ownerOfTwo = await this.erc721.ownerOf(2);
        assert.strictEqual(ownerOfZero, alice);
        assert.strictEqual(ownerOfTwo, alice);
    });

    it("Transfer events are emitted when transferring multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        const { receipt: { logs } } = await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        assert.strictEqual(logs.length, 2);
        assert.strictEqual(logs[0].topics[0], "0x" + keccak("Transfer(address,address,uint256)"));
        assert.strictEqual(logs[0].topics[1].replace("0".repeat(24), ""), alice);
        assert.strictEqual(logs[0].topics[2].replace("0".repeat(24), ""), bob);
        assert.strictEqual(parseInt(logs[0].topics[3]), 0);
        assert.strictEqual(logs[1].topics[0], "0x" + keccak("Transfer(address,address,uint256)"));
        assert.strictEqual(logs[1].topics[1].replace("0".repeat(24), ""), alice);
        assert.strictEqual(logs[1].topics[2].replace("0".repeat(24), ""), bob);
        assert.strictEqual(parseInt(logs[1].topics[3]), 1);
    });

    it("Bob and Charlie are no longer approved after transferring multiple", async () => {
        await this.erc721.mintMultiple(alice, 2);
        await this.erc721.approve(bob, 0, { from: alice });
        await this.erc721.approve(charlie, 1, { from: alice });
        await this.erc721.transferMultipleFrom(alice, bob, 0x3, { from: alice });
        const approvedForZero = await this.erc721.getApproved(0);
        const approvedForOne = await this.erc721.getApproved(1);
        assert.strictEqual(approvedForZero, "0x" + "0".repeat(40));
        assert.strictEqual(approvedForOne, "0x" + "0".repeat(40));
    });
});
