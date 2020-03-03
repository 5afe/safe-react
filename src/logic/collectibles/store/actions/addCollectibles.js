// @flow
import { createAction } from 'redux-actions'

import type { CollectibleData } from '~/routes/safe/components/Balances/Collectibles/types'

export const ADD_COLLECTIBLES = 'ADD_COLLECTIBLES'

const addCollectibles = createAction<string, *, *>(ADD_COLLECTIBLES, (collectibles: CollectibleData[]) => ({
  collectibles,
}))

export default addCollectibles
