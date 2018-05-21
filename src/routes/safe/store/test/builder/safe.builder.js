// @flow
import { makeSafe, type Safe } from '~/routes/safe/store/model/safe'
import { buildOwnersFrom, buildDailyLimitFrom } from '~/routes/safe/store/actions'

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
    this.safe = this.safe.set('confirmations', confirmations)
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

export default aSafe
