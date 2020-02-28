// @flow
import { createStructuredSelector } from 'reselect'

import { networkSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  network: string,
}

export default createStructuredSelector({
  network: networkSelector,
})
