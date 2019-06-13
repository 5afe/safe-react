pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";

contract TokenOMG is GnosisStandardToken {
  string public constant symbol = "OMG";
  string public constant name = "Omisego Token";
  uint8 public constant decimals = 18;

  constructor(
    uint amount
  )
    public 
  {
    balances[msg.sender] = amount;
  }
}