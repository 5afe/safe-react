// @flow
import { Map, List } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import SafeRecord, { type Safe, type SafeProps } from '~/routes/safe/store/models/safe'
import { type OwnerProps } from '~/routes/safe/store/models/owner'
import type { SafeToken } from '~/routes/safe/store/models/safeToken'
import { loadFromStorage } from '~/utils/storage'
import { SAFES_KEY } from '~/logic/safe/utils'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { UPDATE_SAFE_TOKENS } from '~/routes/safe/store/actions/updateActiveTokens'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

export const buildSafe = (storedSafe: SafeProps) => {
  const names = storedSafe.owners.map((owner: OwnerProps) => owner.name)
  const addresses = storedSafe.owners.map((owner: OwnerProps) => owner.address)
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))

  const safe: SafeProps = {
    address: storedSafe.address,
    name: storedSafe.name,
    threshold: storedSafe.threshold,
    tokens: storedSafe.tokens,
    owners,
  }

  return SafeRecord(safe)
}

const buildSafesFrom = (loadedSafes: Object): Map<string, Safe> => {
  const safes: Map<string, Safe> = Map()

  const keys = Object.keys(loadedSafes)
  try {
    const safeRecords = keys.map((address: string) => buildSafe(loadedSafes[address]))

    return safes.withMutations(async (map) => {
      safeRecords.forEach((safe: Safe) => map.set(safe.get('address'), safe))
    })
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error while fetching safes information')

    return Map()
  }
}

export const safesInitialState = async (): Promise<State> => {
  const storedSafes = await loadFromStorage(SAFES_KEY)
  const safes = storedSafes ? buildSafesFrom(storedSafes) : Map()

  return safes
}

export default handleActions<State, *>(
  {
    [UPDATE_SAFE]: (state: State, action: ActionType<Function>): State => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.mergeIn([safeAddress], safe)
    },
    [ADD_SAFE]: (state: State, action: ActionType<Function>): State => {
      const { safe }: { safe: Safe } = action.payload

      return state.set(safe.address, safe)
    },
    [UPDATE_SAFE_TOKENS]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, token: updatedToken } = action.payload

      const tokens: List<SafeToken> = state.getIn([safeAddress, 'tokens'])
      console.log(tokens)
      const index = tokens.findIndex(token => token.address === updatedToken.address)
      console.log('called')
      let newState
      if (index !== -1) {
        newState = state.setIn([safeAddress, 'tokens'], tokens.delete(index))
      } else {
        newState = state.setIn([safeAddress, 'tokens'], tokens.push(updatedToken))
      }
      console.log(newState.toJS())

      return newState
    },
  },
  Map(),
)
