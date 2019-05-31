pragma solidity ^0.5.2;

import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";

contract TokenRDN is GnosisStandardToken {
  string public constant symbol = "RDN";
  string public constant name = "Raiden Token";
  uint8 public constant decimals = 18;

  constructor(
    uint amount
  )
    public 
  {
    balances[msg.sender] = amount;
  }
}