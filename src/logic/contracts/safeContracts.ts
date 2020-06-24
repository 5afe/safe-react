import contract from 'truffle-contract'
import ProxyFactorySol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxyFactory.json'
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import SafeProxy from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafeProxy.json'
import { ensureOnce } from 'src/utils/singleton'
import { simpleMemoize } from 'src/components/forms/validator'
import { getWeb3, getNetworkIdFrom } from 'src/logic/wallets/getWeb3'
import { calculateGasOf, calculateGasPrice } from 'src/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { isProxyCode } from 'src/logic/contracts/historicProxyCode'

export const SENTINEL_ADDRESS = '0x0000000000000000000000000000000000000001'
export const MULTI_SEND_ADDRESS = '0xB522a9f781924eD250A11C54105E51840B138AdD'
export const SAFE_MASTER_COPY_ADDRESS = '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F'
export const DEFAULT_FALLBACK_HANDLER_ADDRESS = '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44'
export const SAFE_MASTER_COPY_ADDRESS_V10 = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A'


let proxyFactoryMaster
let safeMaster

const createGnosisSafeContract = (web3) => {
  const gnosisSafe = contract(GnosisSafeSol)
  gnosisSafe.setProvider(web3.currentProvider)

  return gnosisSafe
}

const createProxyFactoryContract = (web3, networkId) => {
  const contractAddress = ProxyFactorySol.networks[networkId].address
  const proxyFactory = new web3.eth.Contract(ProxyFactorySol.abi as any, contractAddress)

  return proxyFactory
}

export const getGnosisSafeContract = simpleMemoize(createGnosisSafeContract)
const getCreateProxyFactoryContract = simpleMemoize(createProxyFactoryContract)

const instantiateMasterCopies = async () => {
  const web3 = getWeb3()
  const networkId = await getNetworkIdFrom(web3)

  // Create ProxyFactory Master Copy
  proxyFactoryMaster = getCreateProxyFactoryContract(web3, networkId)

  // Initialize Safe master copy
  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.deployed()
}

// ONLY USED IN TEST ENVIRONMENT
const createMasterCopies = async () => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()
  const userAccount = accounts[0]

  const ProxyFactory = getCreateProxyFactoryContract(web3)
  proxyFactoryMaster = await ProxyFactory.new({ from: userAccount, gas: '5000000' })

  const GnosisSafe = getGnosisSafeContract(web3)
  safeMaster = await GnosisSafe.new({ from: userAccount, gas: '7000000' })
}

export const initContracts = process.env.NODE_ENV === 'test' ? ensureOnce(createMasterCopies) : instantiateMasterCopies

export const getSafeMasterContract = async () => {
  await initContracts()

  return safeMaster
}

export const getSafeDeploymentTransaction = (safeAccounts, numConfirmations, userAccount) => {
  const gnosisSafeData = safeMaster.contract.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', DEFAULT_FALLBACK_HANDLER_ADDRESS, ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()  

  return proxyFactoryMaster.methods.createProxy(safeMaster.address, gnosisSafeData)
}

export const estimateGasForDeployingSafe = async (
  safeAccounts,
  numConfirmations,
  userAccount,
) => {
  const gnosisSafeData = await safeMaster.contract.methods
    .setup(safeAccounts, numConfirmations, ZERO_ADDRESS, '0x', DEFAULT_FALLBACK_HANDLER_ADDRESS, ZERO_ADDRESS, 0, ZERO_ADDRESS)
    .encodeABI()
  const proxyFactoryData = proxyFactoryMaster.methods
    .createProxy(safeMaster.address, gnosisSafeData)
    .encodeABI()
  const gas = await calculateGasOf(proxyFactoryData, userAccount, proxyFactoryMaster.address)
  const gasPrice = await calculateGasPrice()

  return gas * parseInt(gasPrice, 10)
}

export const getGnosisSafeInstanceAt = simpleMemoize(async (safeAddress) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = await GnosisSafe.at(safeAddress)
  return gnosisSafe
})

const cleanByteCodeMetadata = (bytecode) => {
  const metaData = 'a165'
  return bytecode.substring(0, bytecode.lastIndexOf(metaData))
}

export const validateProxy = async (safeAddress) => {
  // https://solidity.readthedocs.io/en/latest/metadata.html#usage-for-source-code-verification
  const web3 = getWeb3()
  const code = await web3.eth.getCode(safeAddress)
  const codeWithoutMetadata = cleanByteCodeMetadata(code)
  const supportedProxies = [SafeProxy]
  for (let i = 0; i < supportedProxies.length; i += 1) {
    const proxy = supportedProxies[i]
    const proxyCode = proxy.deployedBytecode
    const proxyCodeWithoutMetadata = cleanByteCodeMetadata(proxyCode)
    if (codeWithoutMetadata === proxyCodeWithoutMetadata) {
      return true
    }
  }


  return isProxyCode(codeWithoutMetadata)
}


export const getEncodedMultiSendCallData = (txs, web3) => {
  const multiSendAbi = [
    {
      type: 'function',
      name: 'multiSend',
      constant: false,
      payable: false,
      stateMutability: 'nonpayable',
      inputs: [{ type: 'bytes', name: 'transactions' }],
      outputs: [],
    },
  ]
  const multiSend = new web3.eth.Contract(multiSendAbi, MULTI_SEND_ADDRESS)
  const encodeMultiSendCallData = multiSend.methods
    .multiSend(
      `0x${txs
        .map((tx) => [
          web3.eth.abi.encodeParameter('uint8', 0).slice(-2),
          web3.eth.abi.encodeParameter('address', tx.to).slice(-40),
          web3.eth.abi.encodeParameter('uint256', tx.value).slice(-64),
          web3.eth.abi
            .encodeParameter(
              'uint256',
              web3.utils.hexToBytes(tx.data).length,
            )
            .slice(-64),
          tx.data.replace(/^0x/, ''),
        ].join(''))
        .join('')}`,
    )
    .encodeABI()

  return encodeMultiSendCallData
}
