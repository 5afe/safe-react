// @flow
import { List } from 'immutable'
import { load, TOKENS_KEY } from '~/utils/localStorage'

const getTokensKey = (safeAddress: string) => `${TOKENS_KEY}-${safeAddress}`

export const setTokens = (safeAddress: string, tokens: List<string>) => {
  try {
    const serializedState = JSON.stringify(tokens)
    const key = getTokensKey(safeAddress)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing tokens in localstorage')
  }
}

export const getTokens = (safeAddress: string): List<string> => {
  const key = getTokensKey(safeAddress)
  const data = load(key)

  return data ? List(data) : List()
}

export const storedTokensBefore = (safeAddress: string) => {
  const key = getTokensKey(safeAddress)
  return localStorage.getItem(key) === null
}
