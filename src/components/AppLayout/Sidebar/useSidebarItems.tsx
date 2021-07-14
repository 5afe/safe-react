import React, { useMemo } from 'react'
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
    address: matchSafeWithAction.params.safeAddress,
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
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const matchSafeWithAction = useRouteMatch({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction/:safeSubaction?`,
  }) as SafeRouteWithAction

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithAddress || !featuresEnabled) {
      return []
    }

    const settingsItem = {
      label: 'Settings',
      icon: <ListIcon type="settings" />,
      href: generatePath(SAFE_ROUTES.SETTINGS_DETAILS, {
        safeAddress,
      }),
      subItems: [
        {
          label: 'Safe Details',
          badge: needsUpdate && granted,
          icon: <ListIcon type="info" />,
          selected: isSelected({ route: SAFE_ROUTES.SETTINGS_DETAILS, matchSafeWithAction }),
          href: generatePath(SAFE_ROUTES.SETTINGS_DETAILS, {
            safeAddress,
          }),
        },
        {
          label: 'Owners',
          icon: <ListIcon type="owners" />,
          selected: isSelected({ route: SAFE_ROUTES.SETTINGS_OWNERS, matchSafeWithAction }),
          href: generatePath(SAFE_ROUTES.SETTINGS_OWNERS, {
            safeAddress,
          }),
        },
        {
          label: 'Policies',
          icon: <ListIcon type="requiredConfirmations" />,
          selected: isSelected({ route: SAFE_ROUTES.SETTINGS_POLICIES, matchSafeWithAction }),
          href: generatePath(SAFE_ROUTES.SETTINGS_POLICIES, {
            safeAddress,
          }),
        },
        {
          disabled: !isSpendingLimitEnabled,
          label: 'Spending Limit',
          icon: <ListIcon type="fuelIndicator" />,
          selected: isSelected({ route: SAFE_ROUTES.SETTINGS_SPENDING_LIMIT, matchSafeWithAction }),
          href: generatePath(SAFE_ROUTES.SETTINGS_SPENDING_LIMIT, {
            safeAddress,
          }),
        },
        {
          label: 'Advanced',
          icon: <ListIcon type="settingsTool" />,
          selected: isSelected({ route: SAFE_ROUTES.SETTINGS_ADVANCED, matchSafeWithAction }),
          href: generatePath(SAFE_ROUTES.SETTINGS_ADVANCED, {
            safeAddress,
          }),
        },
      ],
    }

    return [
      {
        label: 'ASSETS',
        icon: <ListIcon type="assets" />,
        href: generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
          safeAddress,
        }),
        subItems: [
          {
            label: 'Coins',
            icon: <ListIcon type="assets" />,
            selected: isSelected({ route: SAFE_ROUTES.ASSETS_BALANCES, matchSafeWithAction }),
            href: generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
              safeAddress,
            }),
          },
          {
            disabled: !isCollectiblesEnabled,
            label: 'Collectibles',
            icon: <ListIcon type="collectibles" />,
            selected: isSelected({ route: SAFE_ROUTES.ASSETS_COLLECTIBLES, matchSafeWithAction }),
            href: generatePath(SAFE_ROUTES.ASSETS_COLLECTIBLES, {
              safeAddress,
            }),
          },
        ],
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: isSelected({ route: SAFE_ROUTES.TRANSACTIONS, matchSafeWithAction }),
        href: generatePath(SAFE_ROUTES.TRANSACTIONS, {
          safeAddress,
        }),
      },
      {
        label: 'ADDRESS BOOK',
        icon: <ListIcon type="addressBook" />,
        selected: isSelected({ route: SAFE_ROUTES.ADDRESS_BOOK, matchSafeWithAction }),
        href: generatePath(SAFE_ROUTES.ADDRESS_BOOK, {
          safeAddress,
        }),
      },
      {
        label: 'Apps',
        disabled: !safeAppsEnabled,
        icon: <ListIcon type="apps" />,
        selected: isSelected({ route: SAFE_ROUTES.APPS, matchSafeWithAction }),
        href: generatePath(SAFE_ROUTES.APPS, {
          safeAddress,
        }),
      },
      settingsItem,
    ]
  }, [
    safeAddress,
    granted,
    isCollectiblesEnabled,
    isSpendingLimitEnabled,
    matchSafe,
    matchSafeWithAction,
    matchSafeWithAddress,
    needsUpdate,
    safeAppsEnabled,
    featuresEnabled,
  ])
}

export { useSidebarItems }
