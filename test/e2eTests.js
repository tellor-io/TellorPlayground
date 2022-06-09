const { expect } = require("chai");
const { ethers } = require("hardhat");
const h = require("./helpers/helpers");

const abiCoder = new ethers.utils.AbiCoder();
const precision = BigInt(1e18);
const FAUCET_AMOUNT = BigInt(1000) * precision;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TellorPlayground e2e Tests", function() {

	let playground;
	let owner, addr0, addr1, addr2;
    let ethQueryDataArgs = abiCoder.encode(['string', 'string'], ['eth', 'usd'])
    let ethQueryData = abiCoder.encode(['string', 'bytes'], ['SpotPrice', ethQueryDataArgs])
    let ethQueryId = ethers.utils.keccak256(ethQueryData)
    let btcQueryDataArgs = abiCoder.encode(['string', 'string'], ['btc', 'usd'])
    let btcQueryData = abiCoder.encode(['string', 'bytes'], ['SpotPrice', btcQueryDataArgs])
    let btcQueryId = ethers.utils.keccak256(btcQueryData)

	beforeEach(async function () {
		const TellorPlayground = await ethers.getContractFactory("TellorPlayground");
		playground = await TellorPlayground.deploy();
		[owner, addr0, addr1, addr2] = await ethers.getSigners();
		await playground.deployed();
	});

	it("submit value after transferring tokens to playground", async function() {
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(btcQueryId, h.uintTob32(100), 0, btcQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(btcQueryId, h.uintTob32(100), 0, btcQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(btcQueryId, h.uintTob32(100), 0, btcQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
        await playground.faucet(owner.address);
        await playground.transfer(playground.address, FAUCET_AMOUNT);
        await playground.submitValue(ethQueryId, h.uintTob32(100), 0, ethQueryData)
		await h.advanceTime(86400);
        await playground.submitValue(btcQueryId, h.uintTob32(100), 0, btcQueryData)
	});
});
