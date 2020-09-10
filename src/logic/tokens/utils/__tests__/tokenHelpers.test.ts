import logo from 'src/assets/icons/icon_etherTokens.svg'
import { makeToken } from 'src/logic/tokens/store/model/token'
import {
  ETH_ADDRESS,
  getERC20DecimalsAndSymbol,
  getEthAsToken,
  isERC721Contract,
  isTokenTransfer,
} from 'src/logic/tokens/utils/tokenHelpers'
import { getMockedTxServiceModel } from 'src/test/utils/safeHelper'

describe('getEthAsToken', () => {
  it('Should return eth balance as token', () => {
    // given
    const balance = '1000'
    const expectedResult = makeToken({
      address: ETH_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: logo,
      balance,
    })

    // when
    const result = getEthAsToken(balance)

    // then
    expect(result).toStrictEqual(expectedResult)
  })
})

describe('isTokenTransfer', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  it('It should return false if the transaction has no value but but "transfer" function signature is encoded in the data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: '0xa9059cbb' })
    const expectedResult = true
    // when
    const result = isTokenTransfer(transaction)

    // then
    expect(result).toEqual(expectedResult)
  })
  it('It should return false if the transaction has no value but and no "transfer" function signature encoded in data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: '0xa9055cbb' })
    const expectedResult = false
    // when
    const result = isTokenTransfer(transaction)

    // then
    expect(result).toEqual(expectedResult)
  })
  it('It should return false if the transaction has empty data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })
    const expectedResult = false
    // when
    const result = isTokenTransfer(transaction)

    // then
    expect(result).toEqual(expectedResult)
  })
})

jest.mock('src/logic/tokens/store/actions/fetchTokens')
jest.mock('src/logic/contracts/generateBatchRequests')
jest.mock('console')
describe('getERC20DecimalsAndSymbol', () => {
  afterAll(() => {
    jest.unmock('src/logic/tokens/store/actions/fetchTokens')
    jest.unmock('src/logic/contracts/generateBatchRequests')
    jest.unmock('console')
  })
  it('It should return DAI information from the store if given a DAI address', async () => {
    // given
    const tokenAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
    const decimals = Number(18)
    const symbol = 'DAI'
    const token = makeToken({
      address: tokenAddress,
      name: 'Dai',
      symbol,
      decimals,
      logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa.png',
      balance: 0,
    })
    const expectedResult = {
      decimals,
      symbol,
    }

    const fetchTokens = require('src/logic/tokens/store/actions/fetchTokens')
    const spy = fetchTokens.getTokenInfos.mockImplementationOnce(() => token)

    // when
    const result = await getERC20DecimalsAndSymbol(tokenAddress)

    // then
    expect(result).toEqual(expectedResult)
    expect(spy).toHaveBeenCalled()
  })
  it('It should return default value decimals: 18, symbol: UNKNOWN if given a token address and if there is an error fetching the data', async () => {
    // given
    const tokenAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
    const decimals = Number(18)
    const symbol = 'UNKNOWN'

    const expectedResult = {
      decimals,
      symbol,
    }

    const fetchTokens = require('src/logic/tokens/store/actions/fetchTokens')
    const spy = fetchTokens.getTokenInfos.mockImplementationOnce(() => {
      throw new Error()
    })
    console.error = jest.fn()
    const spyConsole = jest.spyOn(console, 'error').mockImplementation()

    // when
    const result = await getERC20DecimalsAndSymbol(tokenAddress)

    // then
    expect(result).toEqual(expectedResult)
    expect(spy).toHaveBeenCalled()
    expect(spyConsole).toHaveBeenCalled()
  })
  it("It should fetch token information from the blockchain if given a token address and if the token doesn't exist in redux store", async () => {
    // given
    const tokenAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
    const decimals = Number(18)
    const symbol = 'DAI'
    const expectedResult = {
      decimals,
      symbol,
    }

    const fetchTokens = require('src/logic/tokens/store/actions/fetchTokens')
    const generateBatchRequests = require('src/logic/contracts/generateBatchRequests')
    const spyTokenInfos = fetchTokens.getTokenInfos.mockImplementationOnce(() => null)

    const spyGenerateBatchRequest = generateBatchRequests.default.mockImplementationOnce(() => [decimals, symbol])

    // when
    const result = await getERC20DecimalsAndSymbol(tokenAddress)

    // then
    expect(result).toEqual(expectedResult)
    expect(spyTokenInfos).toHaveBeenCalled()
    expect(spyGenerateBatchRequest).toHaveBeenCalled()
  })
})

describe('isERC721Contract', () => {
  afterAll(() => {
    jest.unmock('src/logic/tokens/store/actions/fetchTokens')
  })
  beforeEach(() => {
    jest.mock('src/logic/tokens/store/actions/fetchTokens')
  })
  it('It should return false if given non-erc721 contract address', async () => {
    // given
    const contractAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa' // DAI Address
    const expectedResult = false

    // when
    const result = await isERC721Contract(contractAddress)

    // then
    expect(result).toEqual(expectedResult)
  })
  it('It should return true if given a Erc721 contract address', async () => {
    // given
    const contractAddress = '0x014d5883274ab3a9708b0f1e4263df6e90160a30' // dummy ft Address
    const ERC721Contract = {
      at: (address) => address === contractAddress,
    }
    const expectedResult = true

    const fetchTokens = require('src/logic/tokens/store/actions/fetchTokens')
    const standarContractSpy = fetchTokens.getStandardTokenContract.mockImplementation(() => ERC721Contract)

    // when
    const result = await isERC721Contract(contractAddress)

    // then
    expect(result).toEqual(expectedResult)
    expect(standarContractSpy).toHaveBeenCalled()
  })
})
