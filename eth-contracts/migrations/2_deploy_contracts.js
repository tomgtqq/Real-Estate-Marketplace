// migrating the appropriate contracts
//var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");

var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {

  //deployer.deploy(ERC721Mintable,"NFTs_ERC721MintableToken","AGT");

  deployer.deploy(Verifier)
  .then(() => {
      return deployer.deploy(SolnSquareVerifier, Verifier.address, "NFTs_ERC721MintableToken","AGT");
  });
};
