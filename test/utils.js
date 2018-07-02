
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

module.exports.expectThrows = expectThrows;
