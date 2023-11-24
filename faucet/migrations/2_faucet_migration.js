const FaucetConract = artifacts.require("Faucet")


module.exports = function (deployer) {
    deployer.deploy(FaucetConract);
};
