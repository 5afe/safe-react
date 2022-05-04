import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { MODAL_NAME, MODAL_SYMBOL } from "../helpers/constants";
import { main } from "../scripts/98_internalBatchMigration";

chai.use(solidity);
const { expect } = chai;

const chainId = 81;

describe("Chocofactory", function () {
  let signer, factoryContract, moldContract;

  this.beforeEach("initialization.", async function () {
    [signer] = await ethers.getSigners();
    const { factory, mold } = await main();
    factoryContract = factory;
    moldContract = mold;
  });

  it("factory deploy", async function () {
    const deployedMold = await factoryContract.predictDeployResult(
      moldContract.address,
      signer.address,
      MODAL_NAME,
      MODAL_SYMBOL
    );
    await factoryContract.deploy(moldContract.address, MODAL_NAME, MODAL_SYMBOL);
    const deployedMoldContract = moldContract.attach(deployedMold);
    expect(await deployedMoldContract.name()).to.equal(MODAL_NAME);
    expect(await deployedMoldContract.symbol()).to.equal(MODAL_SYMBOL);
  });

  it("factory deployWithSig", async function () {
    const deployedMold = await factoryContract.predictDeployResult(
      moldContract.address,
      signer.address,
      MODAL_NAME,
      MODAL_SYMBOL
    );
    const messageHash = ethers.utils.solidityKeccak256(
      ["uint256", "address", "address", "string", "string"],
      [chainId, factoryContract.address, moldContract.address, MODAL_NAME, MODAL_SYMBOL]
    );
    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await signer.signMessage(messageHashBinary);
    await factoryContract.deployWithSig(moldContract.address, signer.address, MODAL_NAME, MODAL_SYMBOL, signature);
    const deployedMoldContract = moldContract.attach(deployedMold);
    expect(await deployedMoldContract.name()).to.equal(MODAL_NAME);
    expect(await deployedMoldContract.symbol()).to.equal(MODAL_SYMBOL);
  });

  it("factory deployWithSig fail", async function () {
    const messageHash = ethers.utils.solidityKeccak256(
      ["uint256", "address", "address", "string", "string"],
      [chainId, factoryContract.address, moldContract.address, "invalid", MODAL_SYMBOL]
    );
    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await signer.signMessage(messageHashBinary);
    await expect(
      factoryContract.deployWithSig(moldContract.address, signer.address, MODAL_NAME, MODAL_SYMBOL, signature)
    ).to.revertedWith("signature must be valid");
  });

  it("factory deployWithTypedSig", async function () {
    const deployedMold = await factoryContract.predictDeployResult(
      moldContract.address,
      signer.address,
      MODAL_NAME,
      MODAL_SYMBOL
    );
    const domain = {
      name: "Chocofactory",
      version: "1",
      chainId,
      verifyingContract: factoryContract.address,
    };
    const types = {
      Choco: [
        { name: "implementation", type: "address" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
      ],
    };
    const value = {
      implementation: moldContract.address,
      name: MODAL_NAME,
      symbol: MODAL_SYMBOL,
    };
    const signature = await signer._signTypedData(domain, types, value);
    await factoryContract.deployWithTypedSig(moldContract.address, signer.address, MODAL_NAME, MODAL_SYMBOL, signature);
    const deployedMoldContract = moldContract.attach(deployedMold);
    expect(await deployedMoldContract.name()).to.equal(MODAL_NAME);
    expect(await deployedMoldContract.symbol()).to.equal(MODAL_SYMBOL);
  });
  it("factory deployWithTypedSig fail", async function () {
    const domain = {
      name: "Chocofactory",
      version: "invalid",
      chainId,
      verifyingContract: factoryContract.address,
    };
    const types = {
      Choco: [
        { name: "implementation", type: "address" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
      ],
    };
    const value = {
      implementation: moldContract.address,
      name: MODAL_NAME,
      symbol: MODAL_SYMBOL,
    };
    const signature = await signer._signTypedData(domain, types, value);
    await expect(
      factoryContract.deployWithTypedSig(moldContract.address, signer.address, MODAL_NAME, MODAL_SYMBOL, signature)
    ).to.revertedWith("signature must be valid");
  });
});
