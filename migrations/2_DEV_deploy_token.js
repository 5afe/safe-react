/* eslint-disable no-console */
const TokenOMG = artifacts.require('TokenOMG')
const TokenRDN = artifacts.require('TokenRDN')

module.exports = (deployer, network) => {
  let toBN
  if (typeof web3.version === 'string') {
    // 1.X.xx Web3
    ({ toBN } = web3.utils)
  } else {
    toBN = web3.toBigNumber
  }
  if (network === 'development') {
    return deployer
      .deploy(TokenOMG, toBN(50000).mul(toBN(10).pow(toBN(18))))
      .then(() => deployer.deploy(TokenRDN, toBN(50000).mul(toBN(10).pow(toBN(18)))))
  }

  return console.log('Not running on development, skipping.')
}
