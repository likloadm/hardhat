"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const signers_1 = require("../src/signers");
const helpers_1 = require("./helpers");
describe("hardhat-ethers plugin", function () {
    describe("hardhat network with no accounts", function () {
        (0, helpers_1.useEnvironment)("hardhat-project-no-accounts", "hardhat");
        describe("fixture setup", function () {
            it("should not have accounts", async function () {
                const signers = await this.env.ethers.getSigners();
                chai_1.assert.isEmpty(signers);
            });
        });
        describe("getContractAt", function () {
            const signerAddress = "0x1010101010101010101010101010101010101010";
            beforeEach(async function () {
                await this.env.network.provider.send("hardhat_setBalance", [
                    signerAddress,
                    "0x1000000000000000000",
                ]);
                await this.env.run(task_names_1.TASK_COMPILE, { quiet: true });
            });
            describe("with the name and address", function () {
                it("Should return an instance of a contract with a read-only provider", async function () {
                    const receipt = await deployGreeter(this.env, signerAddress);
                    const contract = await this.env.ethers.getContractAt("Greeter", receipt.contractAddress);
                    chai_1.assert.isDefined(contract.provider);
                    chai_1.assert.isNotNull(contract.provider);
                    const greeting = await contract.functions.greet();
                    chai_1.assert.equal(greeting, "Hi");
                });
            });
            describe("with the abi and address", function () {
                it("Should return an instance of a contract with a read-only provider", async function () {
                    const receipt = await deployGreeter(this.env, signerAddress);
                    const signers = await this.env.ethers.getSigners();
                    chai_1.assert.isEmpty(signers);
                    const greeterArtifact = await this.env.artifacts.readArtifact("Greeter");
                    const contract = await this.env.ethers.getContractAt(greeterArtifact.abi, receipt.contractAddress);
                    chai_1.assert.isDefined(contract.provider);
                    chai_1.assert.isNotNull(contract.provider);
                    const greeting = await contract.functions.greet();
                    chai_1.assert.equal(greeting, "Hi");
                });
            });
        });
        describe("getSigner", function () {
            it("should return a valid signer for an arbitrary account", async function () {
                const address = "0x5dA8b30645FAc04eCBC25987A2DFDFa49575945b";
                const signers = await this.env.ethers.getSigners();
                chai_1.assert.isTrue(signers.every((aSigner) => aSigner.address !== address));
                const signer = await this.env.ethers.getSigner(address);
                chai_1.assert.instanceOf(signer, signers_1.SignerWithAddress);
                chai_1.assert.equal(signer.address, address);
            });
        });
    });
});
async function deployGreeter(hre, signerAddress) {
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const tx = Greeter.getDeployTransaction();
    tx.from = signerAddress;
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [signerAddress],
    });
    const txHash = (await hre.network.provider.request({
        method: "eth_sendTransaction",
        params: [tx],
    }));
    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [signerAddress],
    });
    chai_1.assert.isDefined(hre.ethers.provider);
    const receipt = await hre.ethers.provider.getTransactionReceipt(txHash);
    chai_1.assert.equal(receipt.status, 1, "The deployment transaction failed.");
    return receipt;
}
//# sourceMappingURL=no-accounts.js.map