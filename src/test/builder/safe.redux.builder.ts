import makeSafe from 'src/logic/safe/store/models/safe'
import { buildOwnersFrom } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import {
  FIELD_NAME,
  FIELD_CONFIRMATIONS,
  FIELD_OWNERS,
  getOwnerNameBy,
  getOwnerAddressBy,
} from 'src/routes/open/components/fields'
import { getWeb3, getProviderInfo } from 'src/logic/wallets/getWeb3'
import { createSafe, } from 'src/routes/open/container/Open'
import { makeProvider } from 'src/logic/wallets/store/model/provider'
import addProvider from 'src/logic/wallets/store/actions/addProvider'

class SafeBuilder {
  safe

  constructor() {
    this.safe = makeSafe()
  }

  withAddress(address) {
    this.safe = this.safe.set('address', address)
    return this
  }

  withName(name) {
    this.safe = this.safe.set('name', name)
    return this
  }

  withConfirmations(confirmations) {
    this.safe = this.safe.set('threshold', confirmations)
    return this
  }

  withOwner(names, adresses) {
    const owners = buildOwnersFrom(names, adresses)
    this.safe = this.safe.set('owners', owners)
    return this
  }

  get() {
    return this.safe
  }
}

const aSafe = () => new SafeBuilder()

export class SafeFactory {
  static oneOwnerSafe = (ownerAddress = '0x03db1a8b26d08df23337e9276a36b474510f0023') => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0025')
    .withName('Adol ICO Safe')
    .withConfirmations(1)
    .withOwner(['Adol Metamask'], [ownerAddress])
    .get()

  static twoOwnersSafe = (
    firstOwner = '0x03db1a8b26d08df23337e9276a36b474510f0023',
    secondOwner = '0x03db1a8b26d08df23337e9276a36b474510f0024',
  ) => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0026')
    .withName('Adol & Tobias Safe')
    .withConfirmations(2)
    .withOwner(['Adol Metamask', 'Tobias Metamask'], [firstOwner, secondOwner])
    .get()
}

export const aMinedSafe = async (
  store,
  owners = 1,
  threshold = 1,
  name = 'Safe Name',
) => {
  const web3 = getWeb3()
  const provider = await getProviderInfo(web3)
  const walletRecord = makeProvider(provider)
  store.dispatch(addProvider(walletRecord))

  const accounts = await getWeb3().eth.getAccounts()
  const form = {
    [FIELD_NAME]: name,
    [FIELD_CONFIRMATIONS]: `${threshold}`,
    [FIELD_OWNERS]: `${owners}`,
  }

  for (let i = 0; i < owners; i += 1) {
    form[getOwnerNameBy(i)] = `Adol ${i + 1} Eth Account`
    form[getOwnerAddressBy(i)] = accounts[i]
  }

  return createSafe(form, accounts[0]).then((receipt) => receipt.events?.ProxyCreation.returnValues.proxy)
}

export default aSafe
