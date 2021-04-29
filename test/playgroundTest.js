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

	it("Mint from faucet and get user balance", async function() {
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
	});

	it("Get token name and symbol", async function() {
		expect(await tellorPlayground.name()).to.equal(TOKEN_NAME);
		expect(await tellorPlayground.symbol()).to.equal(TOKEN_SYMBOL);
	});

	it("Get token decimals", async function() {
		expect(await tellorPlayground.decimals()).to.equal(18);
	});

	it("Get token total supply", async function() {
		expect(await tellorPlayground.totalSupply()).to.equal(0);
	});

	it("Transfer token", async function() {
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await tellorPlayground.balanceOf(addr1.address)).to.equal(0);
		await tellorPlayground.transfer(addr1.address, BigInt(250) * precision);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(750) * precision);
		expect(await tellorPlayground.balanceOf(addr1.address)).to.equal(BigInt(250) * precision);
		await expect(tellorPlayground.transfer(addr1.address, BigInt(1000) * precision)).to.be.reverted;
	});

	it("Approve transfer, check allowance, and transfer from", async function() {
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

	it("Increase allowance", async function() {
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

	it("Decrease allowance", async function() {
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
	})

  it("Should allow user to submit and retrieve a uint256 value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveData(0, timestamp00)).to.equal(UINT_VALUE_00);
  });

  it("Should allow user to submit and retrieve a bytes value", async function() {
    await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveBytesData(0, timestamp00)).to.equal(BYTES_VALUE_00);
  });

  it("Should allow user to dispute uint value", async function() {
    await tellorPlayground.submitValue(REQUEST_ID_0, UINT_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(UINT_VALUE_00);
    await tellorPlayground.disputeValue(REQUEST_ID_0, timestamp00);
    expect(await tellorPlayground.retrieveData(REQUEST_ID_0, timestamp00)).to.equal(0);
  });

  it("Should allow user to dispute bytes value", async function() {
    await tellorPlayground.submitBytesValue(REQUEST_ID_0, BYTES_VALUE_00);
    let timestamp00 = await tellorPlayground.getTimestampbyRequestIDandIndex(REQUEST_ID_0, 0);
    expect(await tellorPlayground.retrieveBytesData(0, timestamp00)).to.equal(BYTES_VALUE_00);
    await tellorPlayground.disputeBytesValue(REQUEST_ID_0, timestamp00);
    expect(await tellorPlayground.retrieveBytesData(REQUEST_ID_0, timestamp00)).to.equal(BYTES_ZERO);
  });

	it("Should be able to mint from faucet and tip", async function() {
		expect(await tellorPlayground.balanceOf(tellorPlayground.address)).to.equal(0);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(0);
		await tellorPlayground.faucet(owner.address);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(1000) * precision);
		await (tellorPlayground.addTip(REQUEST_ID_0, BigInt(10) * precision));
		expect(await tellorPlayground.balanceOf(tellorPlayground.address)).to.equal(BigInt(10) * precision);
		expect(await tellorPlayground.balanceOf(owner.address)).to.equal(BigInt(990) * precision);
	})
});
