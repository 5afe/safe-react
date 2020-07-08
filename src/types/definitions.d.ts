import Web3 from 'web3'
declare global {
  interface Window {
    web3?: Web3
    testAccountIndex?: string
  }
}
declare module '@openzeppelin/contracts/build/contracts/ERC721'
declare module 'currency-flags/dist/currency-flags.min.css'
