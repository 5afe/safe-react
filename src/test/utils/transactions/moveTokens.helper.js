// @flow
import * as React from 'react'
import { Map } from 'immutable'
import { checkMinedTx, checkPendingTx } from '~/test/builder/safe.dom.utils'
import { makeToken, type Token } from '~/logic/tokens/store/model/token'
import addTokens from '~/logic/tokens/store/actions/saveTokens'

export const dispatchAddTokenToList = async (store: Store, tokenAddress: string) => {
  const fetchTokensMock = jest.fn()
  const tokens: Map<string, Token> = Map().set(
    'TKN',
    makeToken({
      address: tokenAddress,
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    }),
  )
  fetchTokensMock.mockImplementation(() => store.dispatch(addTokens(tokens)))
  fetchTokensMock()
  fetchTokensMock.mockRestore()
}

export const checkMinedMoveTokensTx = (Transaction: React.Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingMoveTokensTx = async (
  Transaction: React.Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
