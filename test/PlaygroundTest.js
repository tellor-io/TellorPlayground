const Tellor = artifacts.require("./TellorPlayground.sol"); // globally injected artifacts helper
const helper = require("./helpers/test_helpers");

contract("TellorPlayground Centralized Tests", function(accounts) {
  let tellor;

  beforeEach("Setup contract for each test", async function() {
    //Could use the getV25(accounts, true), since you're upgrading in the first line of tests. I added full tips to getV25 in testLib already
    master = await Tellor.new("Tellor","TRBP");
  });
  it("Get Symbol and decimals", async function() {
    let symbol = await master.symbol()
    assert.equal(symbol, "TRBP", "the Symbol should be TT");
    data3 = await master.decimals();
    assert(data3 - 0 == 18);
  });
    it("Only owner should be able to add data", async function() {
      console.log(await master.owner())
      console.log(accounts[0],accounts[1])
      await helper.expectThrow(
        master.submitValue(1,200, { from: accounts[1] })
      );
      master.submitValue(1,200, { from: accounts[0] })
  });
    it("Only owner should be able to dispute data", async function() {
      master.submitValue(1,200, { from: accounts[0] })
      time = await master.getTimestampbyRequestIDandIndex(1,0);
      await helper.expectThrow(
        master.disputeValue(1,time, { from: accounts[1] })
      );
      master.disputeValue(1,time, { from: accounts[0] })
    });

    })