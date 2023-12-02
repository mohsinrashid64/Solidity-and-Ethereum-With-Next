// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;



contract Faucet {

  uint public numOfFunders;
  mapping(address => bool) private funders;
  mapping(uint => address) private lutFunders;
  address public owner;

  constructor(){
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(
      msg.sender == owner,
      "Only owner can call this function"
    );
    _;
  }

  modifier limitWithdraw(uint withdrawAmount){
    require(withdrawAmount < 100000000000000000, 
    "Cannot withdraw more than 0.1 ether"
    );
    _;
  }

  receive() external payable {}

  function transferOwnership(address newOwner)external onlyOwner{
    owner = newOwner;
  }

  function addFunds() external payable{
    address funder = msg.sender;

    if(!funders[funder]){
      uint index = numOfFunders++;
      funders[funder]=true;
      lutFunders[index]=funder;
    }
  }

  function test1() external onlyOwner{
    // some mangaing stuff that only admin should have access to
  }

  function test2() external onlyOwner{
    // some mangaing stuff that only admin should have access to
  }

  function withdraw(uint withdrawAmount) external limitWithdraw(withdrawAmount){

    payable(msg.sender).transfer(withdrawAmount); 
  }

  
  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }

    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
  }

}


// COMMANDS TO RUN
/*
truffle migrate --reset
truffle console

const instance = await Faucet.deployed();

instance.addFunds({from:accounts[0],value:"2000000000000000000"})
instance.addFunds({from:accounts[1],value:"2000000000000000000"})

instance.test1({from:accounts[0]})

instance.withdraw("500000000000000000",{from:accounts[1]})

instance.getFunderAtIndex(0)
instance.getAllFunders()
*/