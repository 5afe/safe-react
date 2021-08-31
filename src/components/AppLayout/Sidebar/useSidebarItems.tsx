import React, { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useRouteMatch } from 'react-router-dom'

import { isFeatureEnabled } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { SAFELIST_ADDRESS, SAFE_ROUTES } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { currentSafeFeaturesEnabled, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

type SafeRouteWithAction = {
  url: string
  params: Record<string, string>
}

type IsSelectedProps = {
  route: string
  matchSafeWithAction: SafeRouteWithAction
}

const isSelected = ({ route, matchSafeWithAction }: IsSelectedProps): boolean => {
  const currentRoute = matchSafeWithAction.url
  const expectedRoute = generatePath(route, {
    safeAddress: matchSafeWithAction.params.safeAddress,
  })

  return currentRoute === expectedRoute
}

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = isFeatureEnabled(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = isFeatureEnabled(FEATURES.ERC721)
  const isSpendingLimitEnabled = isFeatureEnabled(FEATURES.SPENDING_LIMIT)
  const { address: safeAddress, needsUpdate } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)

  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })
  const matchSafeWithAction = useRouteMatch({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction/:safeSubaction?`,
  }) as SafeRouteWithAction

  const makeEntryItem = useCallback(
    ({ label, disabled, badge, iconType, route, subItems }) => {
      return {
        label,
        badge,
        disabled,
        icon: <ListIcon type={iconType} />,
        selected: isSelected({ route, matchSafeWithAction }),
        href: generatePath(route, { safeAddress }),
        subItems,
      }
    },
    [matchSafeWithAction, safeAddress],
  )

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithAction || !featuresEnabled || !safeAddress) {
      return []
    }

    const assetsSubItems = [
      makeEntryItem({
        label: 'Coins',
        iconType: 'assets',
        route: SAFE_ROUTES.ASSETS_BALANCES,
      }),
      makeEntryItem({
        disabled: !isCollectiblesEnabled,
        label: 'Collectibles',
        iconType: 'collectibles',
        route: SAFE_ROUTES.ASSETS_COLLECTIBLES,
      }),
    ]

    const settingsSubItems = [
      makeEntryItem({
        label: 'Safe Details',
        badge: needsUpdate && granted,
        iconType: 'info',
        route: SAFE_ROUTES.SETTINGS_DETAILS,
      }),
      makeEntryItem({
        label: 'Owners',
        iconType: 'owners',
        route: SAFE_ROUTES.SETTINGS_OWNERS,
      }),
      makeEntryItem({
        label: 'Policies',
        iconType: 'requiredConfirmations',
        route: SAFE_ROUTES.SETTINGS_POLICIES,
      }),
      makeEntryItem({
        disabled: !isSpendingLimitEnabled,
        label: 'Spending Limit',
        iconType: 'fuelIndicator',
        route: SAFE_ROUTES.SETTINGS_SPENDING_LIMIT,
      }),
      makeEntryItem({
        label: 'Advanced',
        iconType: 'settingsTool',
        route: SAFE_ROUTES.SETTINGS_ADVANCED,
      }),
    ]

    return [
      makeEntryItem({
        label: 'ASSETS',
        iconType: 'assets',
        route: SAFE_ROUTES.ASSETS_BALANCES,
        subItems: assetsSubItems,
      }),
      makeEntryItem({
        label: 'TRANSACTIONS',
        iconType: 'transactionsInactive',
        route: SAFE_ROUTES.TRANSACTIONS,
      }),
      makeEntryItem({
        label: 'ADDRESS BOOK',
        iconType: 'addressBook',
        route: SAFE_ROUTES.ADDRESS_BOOK,
      }),
      makeEntryItem({
        disabled: !safeAppsEnabled,
        label: 'Apps',
        iconType: 'apps',
        route: SAFE_ROUTES.APPS,
      }),
      makeEntryItem({
        label: 'Settings',
        iconType: 'settings',
        route: SAFE_ROUTES.SETTINGS_DETAILS,
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
    matchSafeWithAction,
    needsUpdate,
    safeAddress,
    safeAppsEnabled,
  ])
}

export { useSidebarItems }
