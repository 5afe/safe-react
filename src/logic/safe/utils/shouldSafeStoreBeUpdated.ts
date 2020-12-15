import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { sameString } from 'src/utils/strings'
import { equalArrays } from 'src/utils/arrays'

export const shouldSafeStoreBeUpdated = (
  newSafeProps: Partial<SafeRecordProps>,
  oldSafeProps?: SafeRecordProps,
): boolean => {
  if (!oldSafeProps) return true

  const {
    address,
    name,
    modules,
    spendingLimits,
    nonce,
    threshold,
    featuresEnabled,
    ethBalance,
    latestIncomingTxBlock,
    currentVersion,
    owners,
    activeTokens,
    activeAssets,
    blacklistedAssets,
    blacklistedTokens,
    needsUpdate,
    recurringUser,
    balances,
  } = oldSafeProps

  if (!sameString(address, newSafeProps.address) && newSafeProps.hasOwnProperty('address')) {
    return true
  }

  if (!sameString(name, newSafeProps.name) && newSafeProps.hasOwnProperty('name')) {
    return true
  }

  if (threshold !== newSafeProps.threshold && newSafeProps.hasOwnProperty('threshold')) {
    return true
  }

  if (!sameString(ethBalance, newSafeProps.ethBalance) && newSafeProps.hasOwnProperty('ethBalance')) {
    return true
  }

  if (!owners?.equals(newSafeProps.owners) && newSafeProps.hasOwnProperty('owners')) {
    return true
  }

  if (!equalArrays(modules, newSafeProps.modules) && newSafeProps.hasOwnProperty('modules')) {
    return true
  }

  if (!equalArrays(spendingLimits, newSafeProps.spendingLimits) && newSafeProps.hasOwnProperty('spendingLimits')) {
    return true
  }

  if (!activeTokens?.equals(newSafeProps.activeTokens) && newSafeProps.hasOwnProperty('activeTokens')) {
    return true
  }

  if (!activeAssets?.equals(newSafeProps.activeAssets) && newSafeProps.hasOwnProperty('activeAssets')) {
    return true
  }

  if (!blacklistedTokens?.equals(newSafeProps.blacklistedTokens) && newSafeProps.hasOwnProperty('blacklistedTokens')) {
    return true
  }

  if (!blacklistedAssets?.equals(newSafeProps.blacklistedAssets) && newSafeProps.hasOwnProperty('blacklistedAssets')) {
    return true
  }

  if (!balances?.equals(newSafeProps.balances) && newSafeProps.hasOwnProperty('balances')) {
    return true
  }

  if (nonce !== newSafeProps.nonce && newSafeProps.hasOwnProperty('nonce')) {
    return true
  }

  if (
    latestIncomingTxBlock !== newSafeProps.latestIncomingTxBlock &&
    newSafeProps.hasOwnProperty('latestIncomingTxBlock')
  ) {
    return true
  }

  if (recurringUser !== newSafeProps.recurringUser && newSafeProps.hasOwnProperty('recurringUser')) {
    return true
  }

  if (!sameString(currentVersion, newSafeProps.currentVersion) && newSafeProps.hasOwnProperty('currentVersion')) {
    return true
  }

  if (needsUpdate !== newSafeProps.needsUpdate && newSafeProps.hasOwnProperty('needsUpdate')) {
    return true
  }

  if (!equalArrays(featuresEnabled, newSafeProps.featuresEnabled) && newSafeProps.hasOwnProperty('featuresEnabled')) {
    return true
  }

  return false
}
