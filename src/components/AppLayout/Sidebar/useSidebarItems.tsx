import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { getCurrentShortChainName, isFeatureEnabled } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { FEATURES } from 'src/config/networks/network.d'
import { currentSafeFeaturesEnabled, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  getSafeAddressFromUrl,
  ADDRESSED_ROUTE,
  SAFE_SUBSECTION_ROUTE,
  getAllSafeRoutesWithPrefixedAddress,
} from 'src/routes/routes'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = isFeatureEnabled(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = isFeatureEnabled(FEATURES.ERC721)
  const isSpendingLimitEnabled = isFeatureEnabled(FEATURES.SPENDING_LIMIT)
  const { needsUpdate } = useSelector(currentSafeWithNames)
  const safeAddress = getSafeAddressFromUrl()
  const granted = useSelector(grantedSelector)

  const matchSafe = useRouteMatch(ADDRESSED_ROUTE)

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithSidebarSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const makeEntryItem = useCallback(
    ({ label, disabled, badge, iconType, href, subItems }) => {
      return {
        label,
        badge,
        disabled,
        icon: <ListIcon type={iconType} />,
        selected: href === matchSafeWithSidebarSection?.url,
        href,
        subItems,
      }
    },
    [matchSafeWithSidebarSection],
  )

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithSidebarSection || !featuresEnabled || !safeAddress) {
      return []
    }

    const SAFE_ROUTES_WITH_ADDRESS = getAllSafeRoutesWithPrefixedAddress({
      shortChainName: getCurrentShortChainName(),
      safeAddress,
    })

    const assetsSubItems = [
      makeEntryItem({
        label: 'Coins',
        iconType: 'assets',
        href: SAFE_ROUTES_WITH_ADDRESS.ASSETS_BALANCES,
      }),
      makeEntryItem({
        disabled: !isCollectiblesEnabled,
        label: 'Collectibles',
        iconType: 'collectibles',
        href: SAFE_ROUTES_WITH_ADDRESS.ASSETS_BALANCES_COLLECTIBLES,
      }),
    ]

    const settingsSubItems = [
      makeEntryItem({
        label: 'Safe Details',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_DETAILS,
      }),
      makeEntryItem({
        label: 'Owners',
        iconType: 'owners',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_OWNERS,
      }),
      makeEntryItem({
        label: 'Policies',
        iconType: 'requiredConfirmations',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_POLICIES,
      }),
      makeEntryItem({
        disabled: !isSpendingLimitEnabled,
        label: 'Spending Limit',
        iconType: 'fuelIndicator',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_SPENDING_LIMIT,
      }),
      makeEntryItem({
        label: 'Advanced',
        iconType: 'settingsTool',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_ADVANCED,
      }),
    ]

    return [
      makeEntryItem({
        label: 'ASSETS',
        iconType: 'assets',
        href: SAFE_ROUTES_WITH_ADDRESS.ASSETS_BALANCES,
        subItems: assetsSubItems,
      }),
      makeEntryItem({
        label: 'TRANSACTIONS',
        iconType: 'transactionsInactive',
        href: SAFE_ROUTES_WITH_ADDRESS.TRANSACTIONS,
      }),
      makeEntryItem({
        label: 'ADDRESS BOOK',
        iconType: 'addressBook',
        href: SAFE_ROUTES_WITH_ADDRESS.ADDRESS_BOOK,
      }),
      makeEntryItem({
        disabled: !safeAppsEnabled,
        label: 'Apps',
        iconType: 'apps',
        href: SAFE_ROUTES_WITH_ADDRESS.APPS,
      }),
      makeEntryItem({
        label: 'Settings',
        iconType: 'settings',
        href: SAFE_ROUTES_WITH_ADDRESS.SETTINGS_DETAILS,
        subItems: settingsSubItems,
      }),
    ]
  }, [
    featuresEnabled,
    granted,
    isCollectiblesEnabled,
    isSpendingLimitEnabled,
    makeEntryItem,
    matchSafe,
    matchSafeWithSidebarSection,
    needsUpdate,
    safeAddress,
    safeAppsEnabled,
  ])
}

export { useSidebarItems }
