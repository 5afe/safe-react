// 
import { makeProvider } from 'src/logic/wallets/store/model/provider'

class ProviderBuilder {
  provider

  constructor() {
    this.provider = makeProvider()
  }

  withName(name) {
    this.provider = this.provider.set('name', name)
    return this
  }

  withLoaded(loaded) {
    this.provider = this.provider.set('loaded', loaded)
    return this
  }

  withAvailable(available) {
    this.provider = this.provider.set('available', available)
    return this
  }

  withAccount(account) {
    this.provider = this.provider.set('account', account)
    return this
  }

  get() {
    return this.provider
  }
}

const aProvider = () => new ProviderBuilder()

export class ProviderFactory {
  static metamaskAvailable = aProvider()
    .withName('METAMASK')
    .withLoaded(true)
    .withAvailable(true)
    .withAccount('0xAdbfgh')
    .get()

  static metamaskLoaded = aProvider()
    .withName('METAMASK')
    .withLoaded(true)
    .withAvailable(false)
    .withAccount('')
    .get()

  static noProvider = aProvider()
    .withName('')
    .withLoaded(false)
    .withAvailable(false)
    .withAccount('')
    .get()
}

export default aProvider
