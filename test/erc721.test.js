const web3Abi = require('web3-eth-abi');
const keccak = require('js-sha3').keccak_256;

const ERC721 = artifacts.require("TestERC721.sol");
const TestERC721Receiver = artifacts.require("TestERC721Receiver.sol");
const InvalidTestERC721Receiver = artifacts.require("InvalidTestERC721Receiver.sol");

contract("ERC721", ([owner, alice, bob, charlie]) => {

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

    it("Throws when from is not an owner", async () => {
        await this.erc721.mint(alice);
        await expectThrows(this.erc721.transferFrom(bob, charlie, 0, { from: alice }));
    });

    it("Throws when unapproved actor tries to transfer", async () => {
        await this.erc721.mint(alice);
        await expectThrows(this.erc721.transferFrom(alice, bob, 0, { from: charlie }));
    });

    it("Charlie can transfer to Bob when approved by Alice", async () => {
        await this.erc721.mint(alice);
        await this.erc721.approve(charlie, 0, { from: alice });
        await this.erc721.transferFrom(alice, bob, 0, { from: charlie });
        const owner = await this.erc721.ownerOf(0);
        assert.strictEqual(owner, bob);
    });

    it("Bob cannot transfer when Charlie is approved by Alice", async () => {
        await this.erc721.mint(alice);
        await this.erc721.approve(charlie, 0, { from: alice });
        await expectThrows(this.erc721.transferFrom(alice, charlie, 0, { from: bob }));
    });

    it("Charlie cannot transfer different token", async () => {
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        await this.erc721.approve(charlie, 0, { from: alice });
        await expectThrows(this.erc721.transferFrom(alice, bob, 1, { from: charlie }));
    });

    it("Bob cannot approve Charlie of Alice's token", async () => {
        await this.erc721.mint(alice);
        await expectThrows(this.erc721.approve(charlie, 0, { from: bob }));
    });

    it("Charlie is approved for token", async () => {
        await this.erc721.mint(alice);
        await this.erc721.approve(charlie, 0, { from: alice });
        const approved = await this.erc721.getApproved(0);
        assert.strictEqual(approved, charlie);
    });

    it("Charlie can transfer to Bob when approved for all by Alice", async () => {
        await this.erc721.mint(alice);
        await this.erc721.setApprovalForAll(charlie, true, { from: alice });
        await this.erc721.transferFrom(alice, bob, 0, { from: charlie });
        const owner = await this.erc721.ownerOf(0);
        assert.strictEqual(owner, bob);
    });

    it("Charlie is approved for all by Alice", async () => {
        await this.erc721.setApprovalForAll(charlie, true, { from: alice });
        const approved = await this.erc721.isApprovedForAll(alice, charlie);
        assert.strictEqual(approved, true);
    });

    it("Bob is not approved for all by Alice", async () => {
        await this.erc721.setApprovalForAll(charlie, true, { from: alice });
        const approved = await this.erc721.isApprovedForAll(alice, bob);
        assert.strictEqual(approved, false);
    });

    it("Charlie is not approved for all by Bob", async () => {
        await this.erc721.setApprovalForAll(charlie, true, { from: alice });
        const approved = await this.erc721.isApprovedForAll(bob, charlie);
        assert.strictEqual(approved, false);
    });

    it("Charlie is no longer approved for all by Alice", async () => {
        await this.erc721.setApprovalForAll(charlie, true, { from: alice });
        await this.erc721.setApprovalForAll(charlie, false, { from: alice });
        const approved = await this.erc721.isApprovedForAll(alice, charlie);
        assert.strictEqual(approved, false);
    });

    it("Charlie is no longer approved after transfer", async () => {
        await this.erc721.mint(alice);
        await this.erc721.approve(charlie, 0, { from: alice });
        await this.erc721.transferFrom(alice, bob, 0, { from: charlie });
        const approved = await this.erc721.getApproved(0);
        assert.strictEqual(approved, "0x0000000000000000000000000000000000000000");
    });

    it("Alice has zero balance after safe transfer to Bob", async () => {
        await this.erc721.mint(alice);
        safeTransferFrom([alice, bob, 0], { from: alice, to: this.erc721.address });
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Alice has zero balance after safe transfer with data to Bob", async () => {
        await this.erc721.mint(alice);
        safeTransferFrom([alice, bob, 0, "0xdeadbeef"], { from: alice, to: this.erc721.address });
        const balance = await this.erc721.balanceOf(alice);
        assert.strictEqual(balance.toNumber(), 0);
    });

    it("Receiver contract receives parameters from erc721", async () => {
        const receiver = await TestERC721Receiver.new();
        await this.erc721.mint(alice);
        safeTransferFrom([alice, receiver.address, 0, "0xdeadbeef"], { from: alice, to: this.erc721.address });
        const operator = await receiver.operator();
        const from = await receiver.from();
        const tokenId = await receiver.tokenId();
        const data = await receiver.data();
        assert.strictEqual(operator, alice);
        assert.strictEqual(from, alice);
        assert.strictEqual(tokenId.toNumber(), 0);
        assert.strictEqual(data, "0xdeadbeef");
    });

    it("Receiver contract receives real operator from erc721", async () => {
        const receiver = await TestERC721Receiver.new();
        await this.erc721.mint(alice);
        await this.erc721.approve(bob, 0, { from: alice });
        safeTransferFrom([alice, receiver.address, 0], { from: bob, to: this.erc721.address });
        const operator = await receiver.operator();
        assert.strictEqual(operator, bob);
    });

    it("Receiver contract receives real token id from erc721", async () => {
        const receiver = await TestERC721Receiver.new();
        await this.erc721.mint(alice);
        await this.erc721.mint(alice);
        safeTransferFrom([alice, receiver.address, 1], { from: alice, to: this.erc721.address });
        const tokenId = await receiver.tokenId();
        assert.strictEqual(tokenId.toNumber(), 1);
    });

    it("Throws when receiver returns invalid magic value", async () => {
        const receiver = await InvalidTestERC721Receiver.new();
        await this.erc721.mint(alice);
        try {
            safeTransferFrom([alice, receiver.address, 0], { from: alice, to: this.erc721.address });
            assert.fail();
        } catch (error) {
            if (error.name === "AssertionError") throw error;
        }
    });

    it("Alice cannot approve herself", async () => {
        await this.erc721.mint(alice);
        await expectThrows(this.erc721.approve(alice, 0, { from: alice }));
    });

    it("Alice cannot approve for nonexistent token", async () => {
        await expectThrows(this.erc721.approve(bob, 0, { from: alice }));
    });

    it("Alice cannot approve herself for all", async () => {
        await expectThrows(this.erc721.setApprovalForAll(alice, true, { from: alice }));
    });

    it("Bob as operator can approve Charlie of Alice's token", async () => {
        await this.erc721.mint(alice);
        await this.erc721.setApprovalForAll(bob, true, { from: alice });
        await this.erc721.approve(charlie, 0, { from: bob });
        const approved = await this.erc721.getApproved(0);
        assert.strictEqual(approved, charlie);
    });

    it("Approval event is emitted when Alice approves Bob of token zero", async () => {
        await this.erc721.mint(alice);
        const { receipt: { logs } } = await this.erc721.approve(bob, 0, { from: alice });
        assert.strictEqual(logs.length, 1);
        assert.strictEqual(logs[0].topics[0], "0x" + keccak("Approval(address,address,uint256)"));
        assert.strictEqual(logs[0].topics[1].replace("0".repeat(24), ""), alice);
        assert.strictEqual(logs[0].topics[2].replace("0".repeat(24), ""), bob);
        assert.strictEqual(parseInt(logs[0].topics[3]), 0);
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

function safeTransferFrom(functionParams, executionParams) {
    const safeTransferFromFunc = ERC721.abi.find(f => f.name === 'safeTransferFrom' && f.inputs.length === functionParams.length);
    executionParams.data = web3Abi.encodeFunctionCall(safeTransferFromFunc, functionParams);
    executionParams.gas = 500000;
    const txHash = web3.eth.sendTransaction(executionParams);
    return web3.eth.getTransactionReceipt(txHash);
}
