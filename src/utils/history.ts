import { LocationDescriptorObject } from 'history'
import { setNetworkId } from 'src/logic/config/store/actions'
import { currentShortName, getNetworkByShortName } from 'src/logic/config/store/selectors'
import { hasPrefixedSafeAddressInUrl, extractPrefixedSafeAddress } from 'src/routes/routes'
import { store } from 'src/store'

export const switchNetworkWithUrl = ({ pathname }: LocationDescriptorObject): void => {
  if (!hasPrefixedSafeAddressInUrl()) return

  const state = store.getState()

  const networkShortName = currentShortName(state)
  const { shortName } = extractPrefixedSafeAddress(pathname)

  if (shortName === networkShortName) return

  const { chainId } = getNetworkByShortName(state, shortName)

  store.dispatch(setNetworkId(chainId))
}
