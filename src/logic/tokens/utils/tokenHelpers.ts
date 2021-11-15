import { List } from 'immutable'

import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { currentNetwork } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

export const getEthAsToken = (balance: string | number): Token => {
  const { nativeCurrency } = currentNetwork(store.getState())
  return makeToken({
    ...nativeCurrency,
    balance: {
      tokenBalance: balance.toString(),
    },
  })
}

export type GetTokenByAddress = {
  tokenAddress: string
  tokens: List<Token>
}

type TokenFound = {
  balance: string | number
  decimals: string | number
}

/**
 * Finds and returns a Token object by the provided address
 * @param {string} tokenAddress
 * @param {List<Token>} tokens
 * @returns Token | undefined
 */
export const getBalanceAndDecimalsFromToken = ({ tokenAddress, tokens }: GetTokenByAddress): TokenFound | undefined => {
  const token = tokens?.find(({ address }) => sameAddress(address, tokenAddress))

  if (!token) {
    return
  }

  return {
    balance: token.balance.tokenBalance ?? 0,
    decimals: token.decimals ?? 0,
  }
}
