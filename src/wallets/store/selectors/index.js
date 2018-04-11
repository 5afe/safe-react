// @flow
import { createSelector } from 'reselect'
import type { Provider } from '~/wallets/store/model/provider'
import { PROVIDER_REDUCER_ID } from '~/wallets/store/reducer/provider'

const providerSelector = (state: any): Provider => state[PROVIDER_REDUCER_ID]

export const userAccountSelector = createSelector(
  providerSelector,
  (provider: Provider) => {
    const account = provider.get('account')

    return account || ''
  },
)

export const providerNameSelector = createSelector(
  providerSelector,
  (provider: Provider) => {
    const name = provider.get('name')
    const loaded = provider.get('loaded')
    const available = provider.get('available')

    return loaded && available ? name : undefined
  },
)
