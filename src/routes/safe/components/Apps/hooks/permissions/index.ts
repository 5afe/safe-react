import { RestrictedMethods } from '@gnosis.pm/safe-apps-sdk'
import { AllowedFeatures } from '../../types'

export * from './useBrowserPermissions'
export * from './useSafePermissions'

export const SAFE_PERMISSIONS_TEXTS = {
  [RestrictedMethods.requestAddressBook]: {
    displayName: 'Address Book',
    description: 'Access to your address book',
  },
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const BROWSER_PERMISSIONS_TEXTS = Object.values(AllowedFeatures).reduce((acc, feature) => {
  acc[feature] = {
    displayName: capitalize(feature.toString()),
    description: capitalize(feature.toString()),
  }
  return acc
}, {})
