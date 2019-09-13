// @flow
import { Map, List } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import SafeRecord, { type Safe, type SafeProps } from '~/routes/safe/store/models/safe'
import TokenBalance from '~/routes/safe/store/models/tokenBalance'
import { makeOwner, type OwnerProps } from '~/routes/safe/store/models/owner'
import { loadFromStorage } from '~/utils/storage'
import { SAFES_KEY } from '~/logic/safe/utils'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from '~/routes/safe/store/actions/activateTokenForAllSafes'
import { REMOVE_SAFE } from '~/routes/safe/store/actions/removeSafe'
import { ADD_SAFE_OWNER } from '~/routes/safe/store/actions/addSafeOwner'
import { REMOVE_SAFE_OWNER } from '~/routes/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from '~/routes/safe/store/actions/replaceSafeOwner'
import { EDIT_SAFE_OWNER } from '~/routes/safe/store/actions/editSafeOwner'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

export const buildSafe = (storedSafe: SafeProps) => {
  const names = storedSafe.owners.map((owner: OwnerProps) => owner.name)
  const addresses = storedSafe.owners.map((owner: OwnerProps) => owner.address)
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))
  const activeTokens = List(storedSafe.activeTokens)
  const balances = storedSafe.balances.map((balance) => TokenBalance(balance))

  const safe: SafeProps = {
    ...storedSafe,
    owners,
    balances,
    activeTokens,
  }

  return safe
}

const buildSafesFrom = (loadedSafes: Object): Map<string, Safe> => {
  const safes: Map<string, Safe> = Map()

  const keys = Object.keys(loadedSafes)
  try {
    const safeRecords = keys.map((address: string) => buildSafe(loadedSafes[address]))

    return safes.withMutations(async (map) => {
      safeRecords.forEach((safe: SafeProps) => map.set(safe.address, safe))
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

      return state.update(safeAddress, (prevSafe) => prevSafe.merge(safe))
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state: State, action: ActionType<Function>): State => {
      const tokenAddress = action.payload

      const newState = state.withMutations((map) => {
        map.keySeq().forEach((safeAddress) => {
          const safeActiveTokens = map.getIn([safeAddress, 'activeTokens'])
          const activeTokens = safeActiveTokens.push(tokenAddress)

          map.update(safeAddress, (prevSafe) => prevSafe.merge({ activeTokens }))
        })
      })

      return newState
    },
    [ADD_SAFE]: (state: State, action: ActionType<Function>): State => {
      const { safe }: { safe: SafeProps } = action.payload

      // if you add a new safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.has(safe.address)) {
        return state.update(safe.address, (prevSafe) => prevSafe.merge(safe))
      }

      return state.set(safe.address, SafeRecord(safe))
    },
    [REMOVE_SAFE]: (state: State, action: ActionType<Function>): State => {
      const safeAddress = action.payload

      return state.delete(safeAddress)
    },
    [ADD_SAFE_OWNER]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, ownerName, ownerAddress } = action.payload

      return state.update(safeAddress, (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
      }))
    },
    [REMOVE_SAFE_OWNER]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, ownerAddress } = action.payload

      return state.update(safeAddress, (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
      }))
    },
    [REPLACE_SAFE_OWNER]: (state: State, action: ActionType<Function>): State => {
      const {
        safeAddress, oldOwnerAddress, ownerName, ownerAddress,
      } = action.payload

      return state.update(safeAddress, (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners
          .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
          .push(makeOwner({ address: ownerAddress, name: ownerName })),
      }))
    },
    [EDIT_SAFE_OWNER]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, ownerAddress, ownerName } = action.payload

      return state.update(safeAddress, (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
  },
  Map(),
)
