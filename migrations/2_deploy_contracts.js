var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
  deployer.deploy(Voting, ["0x52616d61" , "0x4e69636b", "0x4a6f7365"]);
};
