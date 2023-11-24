// 2_deploy_contract.js
const SimpleContract = artifacts.require("SimpleContract");

module.exports = function (deployer) {
    deployer.deploy(SimpleContract);
};
