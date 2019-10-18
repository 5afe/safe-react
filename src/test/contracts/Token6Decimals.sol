pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";

contract Token6Decimals is GnosisStandardToken {
  string public constant symbol = "6DEC";
  string public constant name = "6 Decimals";
  uint8 public constant decimals = 6;

  constructor(
    uint amount
  )
    public 
  {
    balances[msg.sender] = amount;
  }
}