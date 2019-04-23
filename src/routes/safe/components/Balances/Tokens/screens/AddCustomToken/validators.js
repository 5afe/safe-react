// @flow
import { fetchToken } from '~/logic/tokens/api'

export const INITIAL_FORM_STATE = {
  address: '',
  decimals: '',
  symbol: '',
  logoUri: '',
}

export const simpleMemoize = (fn: Function) => {
  let lastArg
  let lastResult
  return (arg: any) => {
    if (arg !== lastArg) {
      lastArg = arg
      lastResult = fn(arg)
    }
    return lastResult
  }
}

export const checkTokenExistence = (updateForm: ?Function) => simpleMemoize(async (tokenAddress: string) => {
  if (!tokenAddress && updateForm) {
    updateForm(INITIAL_FORM_STATE)
  }

  const relayToken = await fetchToken(tokenAddress)

  if (!relayToken.data.count) {
    return "Couldn't find the token"
  }

  if (updateForm) {
    const {
      address, symbol, decimals, logoUri,
    } = relayToken.data.results[0]
    updateForm({
      address,
      symbol,
      decimals: String(decimals),
      logoUri,
    })
  }
})
