// @flow
import { COLLECTIBLE_REDUCER_ID } from '~/logic/collectibles/store/reducer/collectibles'
import type { GlobalState } from '~/store'

export const collectiblesSelector = (state: GlobalState) => state[COLLECTIBLE_REDUCER_ID]
