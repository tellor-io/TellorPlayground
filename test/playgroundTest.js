const { expect } = require("chai");
const { ethers } = require("hardhat");
const h = require("./helpers/helpers");
const web3 = require('web3');

const precision = BigInt(1e18);
const FAUCET_AMOUNT = BigInt(1000) * precision;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TellorPlayground", function() {

	let playground;
	let owner, addr0, addr1, addr2;

	beforeEach(async function () {
		const TellorPlayground = await ethers.getContractFactory("TellorPlayground");
		playground = await TellorPlayground.deploy();
		[owner, addr0, addr1, addr2] = await ethers.getSigners();
		await playground.deployed();
	});

	it("constructor()", async function() {
		expect(await playground.name()).to.equal("TellorPlayground");
		expect(await playground.symbol()).to.equal("TRBP");
		expect(await playground.decimals()).to.equal(18);
		expect(await playground.token()).to.equal(playground.address);
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

	it("beginDispute()", async function() {
		await playground.faucet(addr1.address);
		await playground.connect(addr1).submitValue(h.uintTob32(1),150,0,'0x')
		blocky = await h.getBlock()
		await playground.beginDispute(h.uintTob32(1), blocky.timestamp)
		expect(await playground.isDisputed(h.uintTob32(1), blocky.timestamp))
	})

	it("faucet()", async function() {
		expect(await playground.balanceOf(owner.address)).to.equal(0);
		await playground.faucet(owner.address);
		expect(await playground.balanceOf(owner.address)).to.equal(FAUCET_AMOUNT);
		expect(await playground.totalSupply()).to.equal(FAUCET_AMOUNT);
		await expect(playground.faucet(ZERO_ADDRESS)).to.be.reverted;
	});

	it("balanceOf()", async function() {
		await playground.faucet(addr1.address);
		expect(await playground.balanceOf(addr1.address)).to.equal(FAUCET_AMOUNT)
		await playground.connect(addr1).transfer(addr2.address, BigInt(100)*precision)
		expect(await playground.balanceOf(addr1.address)).to.equal(FAUCET_AMOUNT - BigInt(100)*precision)
		expect(await playground.balanceOf(addr2.address)).to.equal(BigInt(100)*precision)
	})

	it("name()", async function() {
		expect(await playground.name()).to.equal("TellorPlayground");
	});

	it("symbol()", async function() {
		expect(await playground.symbol()).to.equal("TRBP");
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

  it("submitValue()", async function() {
		await h.expectThrow(playground.submitValue(h.uintTob32(500),150,0,'0xabcd')) // queryId must equal hash(queryData)
		await h.expectThrow(playground.submitValue(h.uintTob32(1),150,1,'0x')) // nonce must be correct
    await playground.submitValue(h.uintTob32(1),150,0,'0x');
    timestamp = await playground.getTimestampbyQueryIdandIndex(h.uintTob32(1), 0);
		expect(await playground["retrieveData(bytes32,uint256)"](h.uintTob32(1), timestamp) - 150).to.equal(0);
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		timestamp = await playground.getTimestampbyQueryIdandIndex(h.hash("abracadabra"), 0);
		expect(await playground["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), timestamp)).to.equal(h.bytes("houdini"))
  });

	it("retrieveData(bytes32,uint256)", async function() {
    await playground.submitValue(h.uintTob32(1),150,0,'0x')
		blocky = await h.getBlock()
		expect(await playground["retrieveData(bytes32,uint256)"](h.uintTob32(1), blocky.timestamp) - 150).to.equal(0)
		await playground.submitValue(h.hash("abracadabra"), h.bytes("houdini"), 0, h.bytes("abracadabra"))
		blocky = await h.getBlock()
		expect(await playground["retrieveData(bytes32,uint256)"](h.hash("abracadabra"), blocky.timestamp)).to.equal(h.bytes("houdini"))
	})

	it("getNewValueCountbyQueryId()", async function() {
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(0)
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(2))).to.equal(0)
		await playground.submitValue(h.uintTob32(1),150,0,'0x')
		await playground.submitValue(h.uintTob32(1),160,1,'0x')
		await playground.submitValue(h.uintTob32(2),250,0,'0x')
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(1))).to.equal(h.bytes(2))
		expect(await playground.getNewValueCountbyQueryId(h.uintTob32(2))).to.equal(h.bytes(1))
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

	it("getVoteRounds()", async function() {
		await playground.connect(addr1).submitValue(h.uintTob32(1),150,0,'0x')
    	blocky1 = await h.getBlock()
    	await playground.connect(addr1).submitValue(h.uintTob32(1),160,1,'0x')
    	blocky2 = await h.getBlock()
		let hash = ethers.utils.solidityKeccak256(['bytes32','uint256'], [h.uintTob32(1),blocky1.timestamp])
		voteRounds = await playground.getVoteRounds(hash)
		expect(voteRounds.length).to.equal(0)
		await playground.beginDispute(h.uintTob32(1), blocky1.timestamp)
		voteRounds = await playground.getVoteRounds(hash)
		expect(voteRounds.length).to.equal(1)
		expect(voteRounds[0]).to.equal(1)
		await playground.beginDispute(h.uintTob32(1), blocky1.timestamp)
		voteRounds = await playground.getVoteRounds(hash)
		expect(voteRounds.length).to.equal(2)
		expect(voteRounds[0]).to.equal(1)
		expect(voteRounds[1]).to.equal(2)
	})

	it("isInDispute()", async function() {
		blocky = await h.getBlock();
		expect(await playground.isInDispute(h.uintTob32(1), blocky.timestamp)).to.equal(false)
		await playground.beginDispute(h.uintTob32(1), blocky.timestamp)
		expect(await playground.isInDispute(h.uintTob32(1), blocky.timestamp)).to.equal(true)
	})

});
