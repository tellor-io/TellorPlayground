const { expect } = require("chai");

const precision = BigInt(1e18);
const REQUEST_ID_0 = ethers.utils.formatBytes32String("0");
const REQUEST_ID_1 = ethers.utils.formatBytes32String("1");
const FAUCET_AMOUNT = BigInt(1000) * precision;
const TOKEN_NAME = "Testing_TRB";
const TOKEN_SYMBOL = "tTRB";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TellorPlayground", function() {

	let tellorPlayground;
	let owner, addr0, addr1, addr2;

	beforeEach(async function () {
		const TellorPlayground = await ethers.getContractFactory("TellorPlayground");
		tellorPlayground = await TellorPlayground.deploy(TOKEN_NAME, TOKEN_SYMBOL);
		[owner, addr1, addr2] = await ethers.getSigners();
		await tellorPlayground.deployed();
	});

	it("Test Constructor()", async function() {
		expect(await tellorPlayground.name()).to.equal(TOKEN_NAME);
		expect(await tellorPlayground.symbol()).to.equal(TOKEN_SYMBOL);
		expect(await tellorPlayground.decimals()).to.equal(18);
	});

	it("Test Faucet", async function() {
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await tellorPlayground.totalSupply()).to.equal(FAUCET_AMOUNT);
		await expect(tellorPlayground.faucet(ZERO_ADDRESS)).to.be.reverted;
	});

	it("Test Name", async function() {
		expect(await tellorPlayground.name()).to.equal(TOKEN_NAME);
	});

	it("Test Symbol", async function() {
		expect(await tellorPlayground.symbol()).to.equal(TOKEN_SYMBOL);
	});

	it("Test Decimals", async function() {
		expect(await tellorPlayground.decimals()).to.equal(18);
	});

	it("Test Total Supply", async function() {
		expect(await tellorPlayground.totalSupply()).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.totalSupply()).to.equal(BigInt(1000) * precision);
	});

	it("Test Transfer", async function() {
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await tellorPlayground.balanceOf(addr1.address)).to.equal(0);
		await tellorPlayground.transfer(addr1.address, BigInt(250) * precision);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(750) * precision);
		expect(await tellorPlayground.balanceOf(addr1.address)).to.equal(BigInt(250) * precision);
		await expect(tellorPlayground.transfer(addr1.address, BigInt(1000) * precision)).to.be.reverted;
		await expect(tellorPlayground.transfer(ZERO_ADDRESS, 1)).to.be.reverted;
	});

	it("Test Approve", async function() {
		let approvalAmount = BigInt(500) * precision;
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
		await expect(tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.addr2, approvalAmount)).to.be.reverted;
		await tellorPlayground.approve(addr1.address, approvalAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
		await tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.address, approvalAmount);
		expect(await tellorPlayground.balanceOf(addr2.address)).to.equal(approvalAmount);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT - approvalAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
		await expect(tellorPlayground.approve(ZERO_ADDRESS, approvalAmount)).to.be.reverted;
	});

  it("Test Submit Value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0,ethers.utils.formatBytes32String("jjjj"),0);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(ethers.utils.formatBytes32String("jjjj"));
  });

  it("Test Dispute Value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0,ethers.utils.formatBytes32String("500"),0);
	await tellorPlayground.submitValue(REQUEST_ID_0,ethers.utils.formatBytes32String("501"),1);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
	let timestamp01 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 1);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(ethers.utils.formatBytes32String("500"),0);
	expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp01)).to.equal(ethers.utils.formatBytes32String("501"),0);
    await tellorPlayground.disputeValue(REQUEST_ID_0, timestamp00);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal("0x");
	expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp01)).to.equal(ethers.utils.formatBytes32String("501"),0);
	expect(await tellorPlayground.isInDispute(REQUEST_ID_0, timestamp00)).to.equal(true);
	expect(await tellorPlayground.isInDispute(REQUEST_ID_0, timestamp01)).to.equal(false);
  });

	it("Test Retrieve Data", async function() {
		await tellorPlayground.submitValue(REQUEST_ID_0, ethers.utils.formatBytes32String("500"),0);
		await tellorPlayground.submitValue(REQUEST_ID_0, ethers.utils.formatBytes32String("501"),1);
    	let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
		let timestamp01 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 1);
    	expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(ethers.utils.formatBytes32String("500"));
		expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp01)).to.equal(ethers.utils.formatBytes32String("501"));
	});

	it("Test Get New Value Count By Request Id", async function() {
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_0)).to.equal(0);
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_1)).to.equal(0);
		await tellorPlayground.submitValue(REQUEST_ID_0, ethers.utils.formatBytes32String("500"),0);
		await tellorPlayground.submitValue(REQUEST_ID_1, ethers.utils.formatBytes32String("500"),0);
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_0)).to.equal(1);
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_1)).to.equal(1);
  	});

	it("Test Get Timestamp By Request Id and Index", async function() {
		expect(await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0)).to.equal(0);
		await tellorPlayground.submitValue(REQUEST_ID_0,ethers.utils.formatBytes32String("500"),0);
		expect(1 * await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0)).to.be.greaterThan(0)
	});

	it("Test Add Tip", async function() {
		expect(await tellorPlayground.balanceOf(tellorPlayground.address)).to.equal(0);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(1000) * precision);
		await (tellorPlayground.addTip(REQUEST_ID_0, BigInt(10) * precision));
		expect(await tellorPlayground.balanceOf(tellorPlayground.address)).to.equal(BigInt(10) * precision);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(990) * precision);
	});
});
