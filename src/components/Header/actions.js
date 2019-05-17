// @flow
import { fetchProvider, recurrentFetchProvider, removeProvider } from '~/logic/wallets/store/actions'

export type Actions = {
  fetchProvider: typeof fetchProvider,
  recurrentFetchProvider: typeof recurrentFetchProvider,
  removeProvider: typeof removeProvider,
}

export default {
  fetchProvider,
  recurrentFetchProvider,
  removeProvider,
}
