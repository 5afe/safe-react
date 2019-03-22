// @flow
import { List } from 'immutable'
import { load } from '~/utils/localStorage'
import { type Token, type TokenProps } from '~/logic/tokens/store/model/token'

export const ACTIVE_TOKENS_KEY = 'ACTIVE_TOKENS'
export const TOKENS_KEY = 'TOKENS'

const getActiveTokensKey = (safeAddress: string) => `${ACTIVE_TOKENS_KEY}-${safeAddress}`
const getTokensKey = (safeAddress: string) => `${TOKENS_KEY}-${safeAddress}`

export const setActiveTokenAddresses = (safeAddress: string, tokens: List<string>) => {
  try {
    const serializedState = JSON.stringify(tokens)
    const key = getActiveTokensKey(safeAddress)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing tokens in localstorage')
  }
}

export const getActiveTokenAddresses = (safeAddress: string): List<string> => {
  const key = getActiveTokensKey(safeAddress)
  const data = load(key)

  return data ? List(data) : List()
}

export const storedTokensBefore = (safeAddress: string) => {
  const key = getActiveTokensKey(safeAddress)
  return localStorage.getItem(key) === null
}

export const getTokens = (safeAddress: string): List<TokenProps> => {
  const key = getTokensKey(safeAddress)
  const data = load(key)

  return data ? List(data) : List()
}

export const setToken = (safeAddress: string, token: Token) => {
  const data: List<TokenProps> = getTokens(safeAddress)

  try {
    const serializedState = JSON.stringify(data.push(token))
    const key = getTokensKey(safeAddress)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error adding token in localstorage')
  }
}

export const removeTokenFromStorage = (safeAddress: string, token: Token) => {
  const data: List<TokenProps> = getTokens(safeAddress)

  try {
    const index = data.indexOf(token)
    const serializedState = JSON.stringify(data.remove(index))
    const key = getTokensKey(safeAddress)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error removing token in localstorage')
  }
}
