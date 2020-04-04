// 
import { List, Map } from 'immutable'

import { } from 'logic/tokens/store/model/token'
import { loadFromStorage, saveToStorage } from 'utils/storage'

export const ACTIVE_TOKENS_KEY = 'ACTIVE_TOKENS'
export const CUSTOM_TOKENS_KEY = 'CUSTOM_TOKENS'

// Tokens which are active at least in one of used Safes in the app should be saved to localstorage
// to avoid iterating a large amount of data of tokens from the backend
// Custom tokens should be saved too unless they're deleted (marking them as inactive doesn't count)

export const saveActiveTokens = async (tokens) => {
  try {
    await saveToStorage(ACTIVE_TOKENS_KEY, tokens.toJS())
  } catch (err) {
    console.error('Error storing tokens in localstorage', err)
  }
}

export const getActiveTokens = async () => {
  const data = await loadFromStorage(ACTIVE_TOKENS_KEY)

  return data || {}
}

export const getCustomTokens = async () => {
  const data = await loadFromStorage(CUSTOM_TOKENS_KEY)

  return data ? List(data) : List()
}

export const removeTokenFromStorage = async (safeAddress, token) => {
  const data = await getCustomTokens()

  try {
    const index = data.indexOf(token)
    await saveToStorage(CUSTOM_TOKENS_KEY, data.remove(index))
  } catch (err) {
    console.error('Error removing token in localstorage', err)
  }
}

export const removeFromActiveTokens = async (safeAddress, token) => {
  const activeTokens = await getActiveTokens()
  const index = activeTokens.findIndex((activeToken) => activeToken.name === token.name)

  if (index !== -1) {
    await saveActiveTokens(safeAddress, activeTokens.delete(index))
  }
}
