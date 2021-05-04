const { expect } = require("chai");

const precision = BigInt(1e18);
const REQUEST_ID_0 = 0;
const REQUEST_ID_1 = 1;
const UINT_VALUE_00 = 400;
const UINT_VALUE_01 = 39482;
const UINT_VALUE_10 = 38271;
const UINT_VALUE_11 = 83727917;
const BYTES_VALUE_00 = "0xabcd";
const BYTES_VALUE_01 = "0x1234";
const BYTES_VALUE_10 = "0xb9f7";
const BYTES_VALUE_11 = "0x54eb";
const FAUCET_AMOUNT = BigInt(1000) * precision;
const BYTES_ZERO = "0x";
const TOKEN_NAME = "Testing_TRB";
const TOKEN_SYMBOL = "tTRB";

describe("TellorPlayground", function() {

	let tellorPlayground;
	let owner, addr1, addr2;

	beforeEach(async function () {
		const TellorPlayground = await ethers.getContractFactory("TellorPlayground");
		tellorPlayground = await TellorPlayground.deploy(TOKEN_NAME, TOKEN_SYMBOL);
		[owner, addr1, addr2] = await ethers.getSigners();
		await tellorPlayground.deployed();
	});

	it("Test Faucet", async function() {
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
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
	});

	it("Test Increase Allowance", async function() {
		let approvalAmount = BigInt(500) * precision;
		let allowanceIncreaseAmount = BigInt(250) * precision;
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
		await tellorPlayground.approve(addr1.address, approvalAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
		await expect(tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.addr2, approvalAmount + allowanceIncreaseAmount)).to.be.reverted;
		await tellorPlayground.increaseAllowance(addr1.address, allowanceIncreaseAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(approvalAmount + allowanceIncreaseAmount);
		await tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.address, approvalAmount + allowanceIncreaseAmount);
		expect(await tellorPlayground.balanceOf(addr2.address)).to.equal(approvalAmount + allowanceIncreaseAmount);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT - (approvalAmount + allowanceIncreaseAmount));
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
	});

	it("Test Decrease Allowance", async function() {
		let approvalAmount = BigInt(500) * precision;
		let allowanceDecreaseAmount = BigInt(250) * precision;
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
		await tellorPlayground.approve(addr1.address, approvalAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
		await tellorPlayground.decreaseAllowance(addr1.address, allowanceDecreaseAmount);
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(approvalAmount - allowanceDecreaseAmount);
		await expect(tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.addr2, approvalAmount)).to.be.reverted;
		await tellorPlayground.connect(addr1).transferFrom(owner.address, addr2.address, approvalAmount - allowanceDecreaseAmount);
		expect(await tellorPlayground.balanceOf(addr2.address)).to.equal(approvalAmount - allowanceDecreaseAmount);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT - (approvalAmount - allowanceDecreaseAmount));
		expect(await tellorPlayground.allowance(owner.address, addr1.address)).to.equal(0);
	});

  it("Test Submit Value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveData(0, timestamp00)).to.equal(UINT_VALUE_00);
  });

  it("Test Submit Bytes Value", async function() {
    await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveBytesData(0, timestamp00)).to.equal(BYTES_VALUE_00);
  });

  it("Test Dispute Value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(UINT_VALUE_00);
    await tellorPlayground.disputeValue(REQUEST_ID_0, timestamp00);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(0);
		expect(await tellorPlayground.isInDispute(REQUEST_ID_0, timestamp00)).to.equal(true);
  });

  it("Test Dispute Bytes Value", async function() {
    await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveBytesData(0, timestamp00)).to.equal(BYTES_VALUE_00);
    await tellorPlayground.disputeBytesValue(REQUEST_ID_0, timestamp00);
    expect(await tellorPlayground.retrieveBytesData(REQUEST_ID_0, timestamp00)).to.equal(BYTES_ZERO);
		expect(await tellorPlayground.isInDispute(REQUEST_ID_0, timestamp00)).to.equal(true);
  });

	it("Test Retrieve Data", async function() {
		await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
		await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_01);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
		let timestamp01 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 1);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(UINT_VALUE_00);
		expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp01)).to.equal(UINT_VALUE_01);
	});

	it("Test Retrieve Bytes Data", async function() {
		await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_00);
		await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_01);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
		let timestamp01 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 1);
    expect(await tellorPlayground.retrieveBytesData(REQUEST_ID_0, timestamp00)).to.equal(BYTES_VALUE_00);
		expect(await tellorPlayground.retrieveBytesData(REQUEST_ID_0, timestamp01)).to.equal(BYTES_VALUE_01);
	});

	it("Test Get New Value Count By Request Id", async function() {
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_0)).to.equal(0);
		expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_1)).to.equal(0);
    await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
		await tellorPlayground.submitBytesValue(REQUEST_ID_1, BYTES_VALUE_10);
    expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_0)).to.equal(1);
    expect(await tellorPlayground.getNewValueCountbyRequestId(REQUEST_ID_1)).to.equal(1);
  });

	it("Test Get Timestamp By Request Id and Index", async function() {
		expect(await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0)).to.equal(0);
		await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
		expect(await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0)).to.be.above(0);
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
