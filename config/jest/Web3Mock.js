import Web3 from 'web3'

const window = global.window || {}
window.web3 = window.web3 || {}
window.web3.currentProvider = new Web3.providers.HttpProvider('http://localhost:8545')

global.window = window
