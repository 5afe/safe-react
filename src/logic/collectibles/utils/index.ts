import { getNetworkId } from 'src/config'
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

// safeTransferFrom(address,address,uint256)
export const SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH = '42842e0e'

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
