// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_COLLECTIBLES } from '~/logic/collectibles/store/actions/addCollectibles'
import type { CollectibleData } from '~/routes/safe/components/Balances/Collectibles/types'

export const COLLECTIBLE_REDUCER_ID = 'collectibles'

export type State = Map<string, CollectibleData>

export default handleActions<State, *>(
  {
    [ADD_COLLECTIBLES]: (state: State, action: ActionType<Function>): State => {
      const { collectibles }: { collectibles: [CollectibleData] } = action.payload

      return state.withMutations(map => {
        collectibles.forEach(collectible => {
          map.set(collectible.data[0].assetAddress, collectible)
        })
      })
    },
  },
  Map(),
)
