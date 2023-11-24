// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract SimpleContract {
    uint256 public value;

    function setValue(uint256 _newValue) public {
        value = _newValue;
    }
}
