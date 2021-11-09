const { expect } = require("chai");
const { ethers } = require("hardhat");
const h = require("./helpers/helpers");

const precision = BigInt(1e18);
const REQUEST_ID_0 = ethers.utils.formatBytes32String("0");
const REQUEST_ID_1 = ethers.utils.formatBytes32String("1");
const FAUCET_AMOUNT = BigInt(1000) * precision;
const TOKEN_NAME = "Testing_TRB";
const TOKEN_SYMBOL = "tTRB";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TellorPlayground", function() {

	let playground;
	let owner, addr0, addr1, addr2;

	beforeEach(async function () {
		const TellorPlayground = await ethers.getContractFactory("TellorPlayground");
		playground = await TellorPlayground.deploy(TOKEN_NAME, TOKEN_SYMBOL);
		[owner, addr1, addr2] = await ethers.getSigners();
		await playground.deployed();
	});

	it("constructor()", async function() {
		expect(await playground.name()).to.equal(TOKEN_NAME);
		expect(await playground.symbol()).to.equal(TOKEN_SYMBOL);
		expect(await playground.decimals()).to.equal(18);
	});

	it("faucet()", async function() {
		expect(await playground.balanceOf(owner.address)).to.equal(0);
		await playground.faucet(owner.address);
		expect(await playground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await playground.totalSupply()).to.equal(FAUCET_AMOUNT);
		await expect(playground.faucet(ZERO_ADDRESS)).to.be.reverted;
	});

	it("name()", async function() {
		expect(await playground.name()).to.equal(TOKEN_NAME);
	});

	it("symbol()", async function() {
		expect(await playground.symbol()).to.equal(TOKEN_SYMBOL);
	});

	it("decimals()", async function() {
		expect(await playground.decimals()).to.equal(18);
	});

	it("totalSupply()", async function() {
		expect(await playground.totalSupply()).to.equal(0);
		await playground.faucet(owner.address);
		expect(await playground.totalSupply()).to.equal(BigInt(1000) * precision);
	});

	it("transfer()", async function() {
		await playground.faucet(owner.address);
		expect(await playground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await playground.balanceOf(addr1.address)).to.equal(0);
		await playground.transfer(addr1.address, BigInt(250) * precision);
		expect(await playground.balanceOf(owner.address)).to.equal(BigInt(750) * precision);
		expect(await playground.balanceOf(addr1.address)).to.equal(BigInt(250) * precision);
		await expect(playground.transfer(addr1.address, BigInt(1000) * precision)).to.be.reverted;
		await expect(playground.transfer(ZERO_ADDRESS, 1)).to.be.reverted;
	});

	it("approve()", async function() {
		let approvalAmount = BigInt(500) * precision;
		await playground.faucet(owner.address);
		expect(await playground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await playground.allowance(owner.address, addr1.address)).to.equal(0);
		await expect(playground.connect(addr1).transferFrom(owner.address, addr2.addr2, approvalAmount)).to.be.reverted;
		await playground.approve(addr1.address, approvalAmount);
		expect(await playground.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
		await playground.connect(addr1).transferFrom(owner.address, addr2.address, approvalAmount);
		expect(await playground.balanceOf(addr2.address)).to.equal(approvalAmount);
		expect(await playground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT - approvalAmount);
		expect(await playground.allowance(owner.address, addr1.address)).to.equal(0);
		await expect(playground.approve(ZERO_ADDRESS, approvalAmount)).to.be.reverted;
	});

  it("submitValue()", async function() {
		await h.expectThrow(playground.submitValue(h.uintTob32(500),150,0,'0xabcd')) // queryId must equal hash(queryData)
		await h.expectThrow(playground.submitValue(h.uintTob32(1),150,1,'0x')) // nonce must be correct
    await playground.submitValue(h.uintTob32(1),150,0,'0x');
    timestamp = await playground.getTimestampbyRequestIDandIndex(h.uintTob32(1), 0);
		expect(await playground["retrieveData(bytes32,uint256)"](h.uintTob32(1), timestamp) - 150).to.equal(0);
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		timestamp = await playground.getTimestampbyRequestIDandIndex(h.hash("abracadabra"), 0);
		expect(await playground["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), timestamp)).to.equal(h.bytes("houdini"))
  });

	it("beginDispute()", async function() {
		await playground.submitValue(h.uintTob32(1), 150, 0, "0x")
		blocky1 = await ethers.provider.getBlock()
		await playground.submitValue(h.uintTob32(1), 160, 1, "0x")
		blocky2 = await ethers.provider.getBlock()
		await playground.beginDispute(h.uintTob32(1), blocky2.timestamp)
		expect(await playground.values(h.uintTob32(1), blocky2.timestamp)).to.equal("0x")
		expect(await playground.isDisputed(h.uintTob32(1), blocky2.timestamp)).to.equal(true)
		expect(await playground.values(h.uintTob32(1), blocky1.timestamp)).to.equal(h.bytes(150))
		expect(await playground.isDisputed(h.uintTob32(1), blocky1.timestamp)).to.equal(false)
	})

	it("retrieveData(bytes32,uint256)", async function() {
    await playground.submitValue(h.uintTob32(1),150,0,'0x')
		blocky = await h.getBlock()
		expect(await playground["retrieveData(bytes32,uint256)"](h.uintTob32(1), blocky.timestamp) - 150).to.equal(0)
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		blocky = await h.getBlock()
		expect(await playground["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), blocky.timestamp)).to.equal(h.bytes("houdini"))
	})

	it("retrieveData(uint256,uint256)", async function() {
		await playground.submitValue(h.uintTob32(1),150,0,'0x');
		blocky = await h.getBlock()
		expect(await playground["retrieveData(uint256,uint256)"](1, blocky.timestamp) - 150).to.equal(0)
	})

	it("isInDispute()", async function() {
		await playground.submitValue(h.uintTob32(1), 150, 0, "0x")
		blocky1 = await ethers.provider.getBlock()
		await playground.submitValue(h.uintTob32(1), 160, 1, "0x")
		blocky2 = await ethers.provider.getBlock()
		await playground.beginDispute(h.uintTob32(1), blocky2.timestamp)
		expect(await playground.values(h.uintTob32(1), blocky2.timestamp)).to.equal("0x")
		expect(await playground.isDisputed(h.uintTob32(1), blocky2.timestamp)).to.equal(true)
		expect(await playground.values(h.uintTob32(1), blocky1.timestamp)).to.equal(h.bytes(150))
		expect(await playground.isDisputed(h.uintTob32(1), blocky1.timestamp)).to.equal(false)
	})

	it("getNewValueCountbyRequestId()", async function() {
		expect(await playground.getNewValueCountbyRequestId(1)).to.equal(0)
		expect(await playground.getNewValueCountbyRequestId(2)).to.equal(0)
		await playground.submitValue(h.uintTob32(1),150,0,'0x')
		await playground.submitValue(h.uintTob32(1),160,1,'0x')
		await playground.submitValue(h.uintTob32(2),250,0,'0x')
		expect(await playground.getNewValueCountbyRequestId(1)).to.equal(2)
		expect(await playground.getNewValueCountbyRequestId(2)).to.equal(1)
	})

	it("getNewValueCountbyQueryId()", async function() {
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(0)
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(2))).to.equal(0)
		await playground.submitValue(h.uintTob32(1),150,0,'0x')
		await playground.submitValue(h.uintTob32(1),160,1,'0x')
		await playground.submitValue(h.uintTob32(2),250,0,'0x')
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(h.bytes(2))
		expect(await playground.getNewValueCountbyRequestId(h.uintTob32(2))).to.equal(h.bytes(1))
	})

	it("getTimestampbyRequestIDandIndex()", async function() {
		await playground.submitValue(h.uintTob32(1),150,0,'0x')
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyRequestIDandIndex(1,0)).to.equal(blocky.timestamp)
		await playground.submitValue(h.uintTob32(1),160,1,'0x')
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyRequestIDandIndex(1,1)).to.equal(blocky.timestamp)
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyRequestIDandIndex(h.hash("abracadabra"),0)).to.equal(blocky.timestamp)
	})

	it("getTimestampbyQueryIdandIndex()", async function() {
		await playground.submitValue(h.uintTob32(1),150,0,'0x')
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyQueryIdandIndex(h.uintTob32(1),0)).to.equal(blocky.timestamp)
		await playground.submitValue(h.uintTob32(1),160,1,'0x')
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyQueryIdandIndex(h.uintTob32(1),1)).to.equal(blocky.timestamp)
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		blocky = await h.getBlock()
		expect(await playground.getTimestampbyQueryIdandIndex(h.hash("abracadabra"),0)).to.equal(blocky.timestamp)
	})

	it("tipQuery()", async function() {
		expect(await playground.balanceOf(playground.address)).to.equal(0);
		expect(await playground.balanceOf(owner.address)).to.equal(0);
		await playground.faucet(owner.address);
		expect(await playground.balanceOf(owner.address)).to.equal(BigInt(1000) * precision);
		await (playground.tipQuery(h.uintTob32(1), BigInt(10) * precision, '0x'));
		expect(await playground.balanceOf(playground.address)).to.equal(BigInt(10) * precision);
		expect(await playground.balanceOf(owner.address)).to.equal(BigInt(990) * precision);
	});
});
