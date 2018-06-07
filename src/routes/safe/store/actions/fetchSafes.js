// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { load, SAFES_KEY } from '~/utils/localStorage'
import updateSafes from '~/routes/safe/store/actions/updateSafes'
import { buildSafe } from '~/routes/safe/store/actions/fetchSafe'
import { type Safe } from '~/routes/safe/store/model/safe'

const buildSafesFrom = async (loadedSafes: Object): Promise<Map<string, Safe>> => {
  const safes = Map()

  const keys = Object.keys(loadedSafes)
  const safeRecords = await Promise.all(keys.map((address: string) => buildSafe(loadedSafes[address])))

  return safes.withMutations(async (map) => {
    safeRecords.forEach((safe: Safe) => map.set(safe.get('address'), safe))
  })
}

export default () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const storedSafes = load(SAFES_KEY)
  const safes = storedSafes ? await buildSafesFrom(storedSafes) : Map()

  return dispatch(updateSafes(safes))
}
