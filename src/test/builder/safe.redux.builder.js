// @flow
import { makeSafe, type Safe } from '~/routes/safe/store/model/safe'
import addSafe, { buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import { FIELD_NAME, FIELD_CONFIRMATIONS, FIELD_OWNERS, getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import { getWeb3, getProviderInfo } from '~/logic/wallets/getWeb3'
import { createSafe, type OpenState } from '~/routes/open/container/Open'
import { type GlobalState } from '~/store/index'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import addProvider from '~/logic/wallets/store/actions/addProvider'

class SafeBuilder {
  safe: Safe

  constructor() {
    this.safe = makeSafe()
  }

  withAddress(address: string) {
    this.safe = this.safe.set('address', address)
    return this
  }

  withName(name: string) {
    this.safe = this.safe.set('name', name)
    return this
  }

  withConfirmations(confirmations: number) {
    this.safe = this.safe.set('threshold', confirmations)
    return this
  }

  withOwner(names: string[], adresses: string[]) {
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
  static oneOwnerSafe = (ownerAddress: string = '0x03db1a8b26d08df23337e9276a36b474510f0023') => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0025')
    .withName('Adol ICO Safe')
    .withConfirmations(1)
    .withOwner(['Adol Metamask'], [ownerAddress])
    .get()

  static twoOwnersSafe = (firstOwner: string = '0x03db1a8b26d08df23337e9276a36b474510f0023', secondOwner: string = '0x03db1a8b26d08df23337e9276a36b474510f0024') => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0026')
    .withName('Adol & Tobias Safe')
    .withConfirmations(2)
    .withOwner(
      ['Adol Metamask', 'Tobias Metamask'],
      [firstOwner, secondOwner],
    )
    .get()
}

export const aMinedSafe = async (
  store: Store<GlobalState>,
  owners: number = 1,
  threshold: number = 1,
): Promise<string> => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  store.dispatch(addProvider(walletRecord))

  const accounts = await getWeb3().eth.getAccounts()
  const form = {
    [FIELD_NAME]: 'Safe Name',
    [FIELD_CONFIRMATIONS]: `${threshold}`,
    [FIELD_OWNERS]: `${owners}`,
  }

  for (let i = 0; i < owners; i += 1) {
    form[getOwnerNameBy(i)] = `Adol ${i + 1} Eth Account`
    form[getOwnerAddressBy(i)] = accounts[i]
  }

  const addSafeFn: any = (...args) => store.dispatch(addSafe(...args))
  const openSafeProps: OpenState = await createSafe(form, accounts[0], addSafeFn)

  return openSafeProps.safeAddress
}

export default aSafe
