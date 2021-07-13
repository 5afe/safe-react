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

type isSelectedProps = {
  route: string
  safeAction: string
  safeSubaction?: string
}

const isSelected = ({ route, safeAction, safeSubaction }: isSelectedProps) => {
  const [, , , action, subAction] = route.split('/')

  return safeAction === action && (safeSubaction ? safeSubaction === subAction : true)
}

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = isFeatureEnabled(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = isFeatureEnabled(FEATURES.ERC721)
  const isSpendingLimitEnabled = isFeatureEnabled(FEATURES.SPENDING_LIMIT)
  const { address, needsUpdate } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)

  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const matchSafeWithAction = useRouteMatch({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction/:safeSubaction?`,
  }) as {
    url: string
    params: Record<string, string>
  }

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithAddress || !featuresEnabled) {
      return []
    }

    const { safeAction, safeSubaction } = matchSafeWithAction?.params

    const settingsItem = {
      label: 'Settings',
      icon: <ListIcon type="settings" />,
      selected: isSelected({ route: SAFE_ROUTES.DETAILS, safeAction }),
      href: generatePath(SAFE_ROUTES.DETAILS, {
        address,
      }),
      subItems: [
        {
          label: 'Safe Details',
          badge: needsUpdate && granted,
          icon: <ListIcon type="info" />,
          selected: isSelected({ route: SAFE_ROUTES.DETAILS, safeAction, safeSubaction }),
          href: generatePath(SAFE_ROUTES.DETAILS, {
            address,
          }),
        },
        {
          label: 'Owners',
          icon: <ListIcon type="owners" />,
          selected: isSelected({ route: SAFE_ROUTES.OWNERS, safeAction, safeSubaction }),
          href: generatePath(SAFE_ROUTES.OWNERS, {
            address,
          }),
        },
        {
          label: 'Policies',
          icon: <ListIcon type="requiredConfirmations" />,
          selected: isSelected({ route: SAFE_ROUTES.POLICIES, safeAction, safeSubaction }),
          href: generatePath(SAFE_ROUTES.POLICIES, {
            address,
          }),
        },
        {
          disabled: !isSpendingLimitEnabled,
          label: 'Spending Limit',
          icon: <ListIcon type="fuelIndicator" />,
          selected: isSelected({ route: SAFE_ROUTES.SPENDING_LIMIT, safeAction, safeSubaction }),
          href: generatePath(SAFE_ROUTES.SPENDING_LIMIT, {
            address,
          }),
        },
        {
          label: 'Advanced',
          icon: <ListIcon type="settingsTool" />,
          selected: isSelected({ route: SAFE_ROUTES.ADVANCED, safeAction, safeSubaction }),
          href: generatePath(SAFE_ROUTES.ADVANCED, {
            address,
          }),
        },
      ],
    }

    return [
      {
        label: 'ASSETS',
        icon: <ListIcon type="assets" />,
        selected: safeAction === 'balances',
        href: `${matchSafeWithAddress?.url}/balances`,
        subItems: [
          {
            label: 'Coins',
            icon: <ListIcon type="assets" />,
            selected: safeAction === 'balances' && safeSubaction === undefined,
            href: `${matchSafeWithAddress?.url}/balances`,
          },
          {
            disabled: !isCollectiblesEnabled,
            label: 'Collectibles',
            icon: <ListIcon type="collectibles" />,
            selected: safeAction === 'balances' && safeSubaction === 'collectibles',
            href: `${matchSafeWithAddress?.url}/balances/collectibles`,
          },
        ],
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: safeAction === 'transactions',
        href: `${matchSafeWithAddress?.url}/transactions`,
      },
      {
        label: 'ADDRESS BOOK',
        icon: <ListIcon type="addressBook" />,
        selected: safeAction === 'address-book',
        href: `${matchSafeWithAddress?.url}/address-book`,
      },
      {
        label: 'Apps',
        disabled: !safeAppsEnabled,
        icon: <ListIcon type="apps" />,
        selected: safeAction === 'apps',
        href: `${matchSafeWithAddress?.url}/apps`,
      },
      settingsItem,
    ]
  }, [
    address,
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
