import { Map } from 'immutable'

import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { TokenProps, Token } from './../store/model/token'

export const ACTIVE_TOKENS_KEY = 'ACTIVE_TOKENS'
export const CUSTOM_TOKENS_KEY = 'CUSTOM_TOKENS'

// Tokens which are active at least in one of used Safes in the app should be saved to localstorage
// to avoid iterating a large amount of data of tokens from the backend
// Custom tokens should be saved too unless they're deleted (marking them as inactive doesn't count)

export const saveActiveTokens = async (tokens: Map<string, Token>): Promise<void> => {
  try {
    await saveToStorage(ACTIVE_TOKENS_KEY, tokens.toJS() as Record<string, TokenProps>)
  } catch (err) {
    console.error('Error storing tokens in localstorage', err)
  }
}

export const getActiveTokens = async (): Promise<Record<string, TokenProps> | undefined> => {
  const data = await loadFromStorage<Record<string, TokenProps>>(ACTIVE_TOKENS_KEY)

  return data
}
