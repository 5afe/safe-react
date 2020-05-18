// 
import { Record } from 'immutable'


export const makeProvider = Record({
  name: '',
  loaded: false,
  available: false,
  account: '',
  network: 0,
  smartContractWallet: false,
  hardwareWallet: false,
})


// Useage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })
