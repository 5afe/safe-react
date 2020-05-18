// 
import { createStructuredSelector } from 'reselect'

import { networkSelector } from '~/logic/wallets/store/selectors'


export default createStructuredSelector({
  network: networkSelector,
})
