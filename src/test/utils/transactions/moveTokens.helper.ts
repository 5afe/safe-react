// 
import * as React from 'react'
import { Map } from 'immutable'
import { checkMinedTx, checkPendingTx } from 'src/test/builder/safe.dom.utils'
import { makeToken, } from 'src/logic/tokens/store/model/token'
import addTokens from 'src/logic/tokens/store/actions/saveTokens'

export const dispatchAddTokenToList = async (store, tokenAddress) => {
  const fetchTokensMock = jest.fn()
  const tokens = Map().set(
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

export const checkMinedMoveTokensTx = (Transaction, name) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingMoveTokensTx = async (
  Transaction,
  safeThreshold,
  name,
  statusses,
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
