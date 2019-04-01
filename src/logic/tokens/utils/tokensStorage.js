// @flow
import { List } from 'immutable'
import { type Token, type TokenProps } from '~/logic/tokens/store/model/token'
import { storage, load } from '~/utils/storage'

export const ACTIVE_TOKENS_KEY = 'ACTIVE_TOKENS'
export const TOKENS_KEY = 'TOKENS'

const getActiveTokensKey = (safeAddress: string) => `${ACTIVE_TOKENS_KEY}-${safeAddress}`
const getTokensKey = (safeAddress: string) => `${TOKENS_KEY}-${safeAddress}`

export const setActiveTokens = async (safeAddress: string, tokens: List<TokenProps>) => {
  try {
    const serializedState = JSON.stringify(tokens.toJS())
    const key = getActiveTokensKey(safeAddress)
    await storage.set(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing tokens in localstorage')
  }
}

export const getActiveTokens = async (safeAddress: string): Promise<List<TokenProps>> => {
  const key = getActiveTokensKey(safeAddress)
  const data = await load(key)

  return data ? List(data) : List()
}

export const getTokens = async (safeAddress: string): Promise<List<TokenProps>> => {
  const key = getTokensKey(safeAddress)
  const data = await load(key)

  return data ? List(data) : List()
}

export const setToken = async (safeAddress: string, token: Token) => {
  const data: List<TokenProps> = await getTokens(safeAddress)

  try {
    const serializedState = JSON.stringify(data.push(token))
    const key = getTokensKey(safeAddress)
    await storage.set(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error adding token in localstorage')
  }
}

export const removeTokenFromStorage = async (safeAddress: string, token: Token) => {
  const data: List<TokenProps> = await getTokens(safeAddress)

  try {
    const index = data.indexOf(token)
    const serializedState = JSON.stringify(data.remove(index))
    const key = getTokensKey(safeAddress)
    await storage.set(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error removing token in localstorage')
  }
}

export const removeFromActiveTokens = async (safeAddress: string, token: Token) => {
  const activeTokens = await getActiveTokens(safeAddress)
  const index = activeTokens.findIndex(activeToken => activeToken.name === token.name)

  if (index !== -1) {
    await setActiveTokens(safeAddress, activeTokens.delete(index))
  }
}
