// @flow
import type { Provider } from '~/wallets/store/model/provider'
import { makeProvider } from '~/wallets/store/model/provider'

class ProviderBuilder {
  provider: Provider

  constructor() {
    this.provider = makeProvider()
  }

  withName(name: string) {
    this.provider = this.provider.set('name', name)
    return this
  }

  withLoaded(loaded: boolean) {
    this.provider = this.provider.set('loaded', loaded)
    return this
  }

  withAvailable(available: boolean) {
    this.provider = this.provider.set('available', available)
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
    .get()

  static metamaskLoaded = aProvider()
    .withName('METAMASK')
    .withLoaded(true)
    .withAvailable(false)
    .get()

  static noProvider = aProvider()
    .withName('')
    .withLoaded(false)
    .withAvailable(false)
    .get()
}

export default aProvider
