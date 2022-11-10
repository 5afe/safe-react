import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { currentSafeFeaturesEnabled, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { ADDRESSED_ROUTE, SAFE_SUBSECTION_ROUTE, generatePrefixedAddressRoutes } from 'src/routes/routes'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = hasFeature(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = hasFeature(FEATURES.ERC721)
  const isSpendingLimitEnabled = hasFeature(FEATURES.SPENDING_LIMIT)
  const { needsUpdate } = useSelector(currentSafeWithNames)
  const { shortName, safeAddress } = useSafeAddress()
  const granted = useSelector(grantedSelector)

  const matchSafe = useRouteMatch(ADDRESSED_ROUTE)

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithSidebarSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const makeEntryItem = useCallback(
    ({ label, disabled, badge, iconType, href, subItems }) => ({
      label,
      badge,
      disabled,
      icon: <ListIcon type={iconType} size="sm" color="text" />,
      selected: href === matchSafeWithSidebarSection?.url,
      href,
      subItems,
    }),
    [matchSafeWithSidebarSection],
  )

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithSidebarSection || !featuresEnabled || !safeAddress) {
      return []
    }

    const currentSafeRoutes = generatePrefixedAddressRoutes({
      shortName,
      safeAddress,
    })

    const assetsSubItems = [
      makeEntryItem({
        label: 'Coins',
        iconType: 'assets',
        href: currentSafeRoutes.ASSETS_BALANCES,
      }),
      makeEntryItem({
        disabled: !isCollectiblesEnabled,
        label: 'NFTs',
        iconType: 'collectibles',
        href: currentSafeRoutes.ASSETS_BALANCES_COLLECTIBLES,
      }),
    ]

    const transactionsSubItems = [
      makeEntryItem({
        label: 'Queue',
        href: currentSafeRoutes.TRANSACTIONS_QUEUE,
      }),
      makeEntryItem({
        label: 'History',
        href: currentSafeRoutes.TRANSACTIONS_HISTORY,
      }),
    ]

    const settingsSubItems = [
      makeEntryItem({
        label: 'Safe Details',
        badge: needsUpdate && granted,
        iconType: 'info',
        href: currentSafeRoutes.SETTINGS_DETAILS,
      }),
      makeEntryItem({
        label: 'Appearance',
        iconType: 'eye',
        href: currentSafeRoutes.SETTINGS_APPEARANCE,
      }),
      makeEntryItem({
        label: 'Owners',
        iconType: 'owners',
        href: currentSafeRoutes.SETTINGS_OWNERS,
      }),
      makeEntryItem({
        label: 'Policies',
        iconType: 'requiredConfirmations',
        href: currentSafeRoutes.SETTINGS_POLICIES,
      }),
      makeEntryItem({
        disabled: !isSpendingLimitEnabled,
        label: 'Spending Limit',
        iconType: 'fuelIndicator',
        href: currentSafeRoutes.SETTINGS_SPENDING_LIMIT,
      }),
      makeEntryItem({
        label: 'Advanced',
        iconType: 'settingsTool',
        href: currentSafeRoutes.SETTINGS_ADVANCED,
      }),
  
    ].filter(Boolean)

    return [
      makeEntryItem({
        label: 'Home',
        iconType: 'home',
        href: currentSafeRoutes.DASHBOARD,
      }),
      makeEntryItem({
        label: 'Assets',
        iconType: 'assets',
        href: currentSafeRoutes.ASSETS_BALANCES,
        subItems: assetsSubItems,
      }),
      makeEntryItem({
        label: 'Transactions',
        iconType: 'transactionsInactive',
        href: currentSafeRoutes.TRANSACTIONS_HISTORY,
        subItems: transactionsSubItems,
      }),
      makeEntryItem({
        label: 'Address Book',
        iconType: 'addressBook',
        href: currentSafeRoutes.ADDRESS_BOOK,
      }),
      makeEntryItem({
        disabled: !safeAppsEnabled,
        label: 'Apps',
        iconType: 'apps',
        href: currentSafeRoutes.APPS,
      }),
      makeEntryItem({
        label: 'Settings',
        iconType: 'settings',
        href: currentSafeRoutes.SETTINGS_DETAILS,
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
    shortName,
  ])
}

export { useSidebarItems }
