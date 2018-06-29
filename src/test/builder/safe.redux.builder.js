// @flow
import { makeSafe, type Safe } from '~/routes/safe/store/model/safe'
import { buildOwnersFrom, buildDailyLimitFrom } from '~/routes/safe/store/actions'
import { FIELD_NAME, FIELD_CONFIRMATIONS, FIELD_OWNERS, getOwnerNameBy, getOwnerAddressBy, FIELD_DAILY_LIMIT } from '~/routes/open/components/fields'
import { getWeb3, getProviderInfo } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import addSafe from '~/routes/safe/store/actions/addSafe'
import { createSafe, type OpenState } from '~/routes/open/container/Open'
import { type GlobalState } from '~/store/index'
import { makeProvider } from '~/wallets/store/model/provider'
import addProvider from '~/wallets/store/actions/addProvider'

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

  withDailyLimit(limit: number, spentToday: number = 0) {
    const dailyLimit = buildDailyLimitFrom(limit, spentToday)
    this.safe = this.safe.set('dailyLimit', dailyLimit)
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
    .withDailyLimit(10)
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
    .withDailyLimit(10, 1.34)
    .get()

    static dailyLimitSafe = (dailyLimit: number, spentToday: number) => aSafe()
      .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0027')
      .withName('Adol & Tobias Safe')
      .withConfirmations(2)
      .withOwner(
        ['Adol Metamask', 'Tobias Metamask'],
        ['0x03db1a8b26d08df23337e9276a36b474510f0023', '0x03db1a8b26d08df23337e9276a36b474510f0024'],
      )
      .withDailyLimit(dailyLimit, spentToday)
      .get()
}

export const aMinedSafe = async (
  store: Store<GlobalState>,
  owners: number = 1,
  threshold: number = 1,
  dailyLimit: number = 0.5,
): Promise<string> => {
  const provider = await getProviderInfo()
  const walletRecord = makeProvider(provider)
  store.dispatch(addProvider(walletRecord))

  const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  const form = {
    [FIELD_NAME]: 'Safe Name',
    [FIELD_CONFIRMATIONS]: `${threshold}`,
    [FIELD_OWNERS]: `${owners}`,
    [getOwnerNameBy(0)]: 'Adolfo 1 Eth Account',
    [getOwnerAddressBy(0)]: accounts[0],
    [FIELD_DAILY_LIMIT]: `${dailyLimit}`,
  }

  const addSafeFn: any = (...args) => store.dispatch(addSafe(...args))
  const openSafeProps: OpenState = await createSafe(form, accounts[0], addSafeFn)

  return openSafeProps.safeAddress
}

export default aSafe
