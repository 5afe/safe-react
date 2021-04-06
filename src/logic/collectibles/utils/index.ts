import { getNetworkId, getNetworkInfo } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { getERC721TokenContract, getStandardTokenContract } from 'src/logic/tokens/store/actions/fetchTokens'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { CollectibleTx } from 'src/routes/safe/components/Balances/SendModal/screens/ReviewCollectible'

// CryptoKitties Contract Addresses by network
// This is an exception made for a popular NFT that's not ERC721 standard-compatible,
//  so we can allow the user to transfer the assets by using `transferFrom` instead of
//  the standard `safeTransferFrom` method.
export const CK_ADDRESS = {
  [ETHEREUM_NETWORK.MAINNET]: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  [ETHEREUM_NETWORK.RINKEBY]: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
}

// Note: xDAI ENS is missing, once we have it we need to add it here
const ENS_CONTRACT_ADDRESS = {
  [ETHEREUM_NETWORK.MAINNET]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
  [ETHEREUM_NETWORK.RINKEBY]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
  [ETHEREUM_NETWORK.ENERGY_WEB_CHAIN]: '0x0A6d64413c07E10E890220BBE1c49170080C6Ca0',
  [ETHEREUM_NETWORK.VOLTA]: '0xd7CeF70Ba7efc2035256d828d5287e2D285CD1ac',
}

// safeTransferFrom(address,address,uint256)
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

/**
 * Returns the symbol of the provided ERC721 contract
 * @param {string} contractAddress
 * @returns Promise<string>
 */
export const getERC721Symbol = async (contractAddress: string): Promise<string> => {
  let tokenSymbol = 'UNKNOWN'

  try {
    const ERC721token = await getERC721TokenContract()
    const tokenInstance = await ERC721token.at(contractAddress)
    tokenSymbol = await tokenInstance.symbol()
  } catch (err) {
    // If the contract address is an ENS token contract, we know that the ERC721 standard is not proper implemented
    // The method symbol() is missing
    if (isENSContract(contractAddress)) {
      return 'ENS'
    }
    console.error(`Failed to retrieve token symbol for ERC721 token ${contractAddress}`)
  }

  return tokenSymbol
}

export const isENSContract = (contractAddress: string): boolean => {
  const { id } = getNetworkInfo()
  return sameAddress(contractAddress, ENS_CONTRACT_ADDRESS[id])
}

/**
 * Returns a method identifier based on the asset specified and the current network
 * @param {string} contractAddress
 * @returns string
 */
export const getTransferMethodByContractAddress = (contractAddress: string): string => {
  if (sameAddress(contractAddress, CK_ADDRESS[getNetworkId()])) {
    // on mainnet `transferFrom` seems to work fine but we can assure that `transfer` will work on both networks
    // so that's the reason why we're falling back to `transfer` for CryptoKitties
    return 'transfer'
  }

  return `0x${SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH}`
}

/**
 * Builds the encodedABI data for the transfer of an NFT token
 * @param {CollectibleTx} tx
 * @param {string} safeAddress
 * @returns Promise<string>
 */
export const generateERC721TransferTxData = async (
  tx: CollectibleTx,
  safeAddress: string | undefined,
): Promise<string> => {
  if (!safeAddress) {
    throw new Error('Failed to build NFT transfer tx data. SafeAddress is not defined.')
  }

  const methodToCall = getTransferMethodByContractAddress(tx.assetAddress)
  let transferParams = [tx.recipientAddress, tx.nftTokenId]
  let NFTTokenContract

  if (methodToCall.includes(SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH)) {
    // we add the `from` param for the `safeTransferFrom` method call
    transferParams = [safeAddress, ...transferParams]
    NFTTokenContract = await getERC721TokenContract()
  } else {
    // we fallback to an ERC20 Token contract whose ABI implements the `transfer` method
    NFTTokenContract = await getStandardTokenContract()
  }

  const tokenInstance = await NFTTokenContract.at(tx.assetAddress)

  return tokenInstance.contract.methods[methodToCall](...transferParams).encodeABI()
}
