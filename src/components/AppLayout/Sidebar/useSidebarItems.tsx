import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { isFeatureEnabled } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { currentSafeFeaturesEnabled, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = isFeatureEnabled(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = isFeatureEnabled(FEATURES.ERC721)
  const isSpendingLimitEnabled = isFeatureEnabled(FEATURES.SPENDING_LIMIT)
  const { needsUpdate } = useSelector(currentSafeWithNames)
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
      selected: safeAction === 'settings',
      href: `${matchSafeWithAddress?.url}/settings/details`,
      subItems: [
        {
          label: 'Safe Details',
          badge: needsUpdate && granted,
          icon: <ListIcon type="info" />,
          selected: safeAction === 'settings' && safeSubaction === 'details',
          href: `${matchSafeWithAddress?.url}/settings/details`,
        },
        {
          label: 'Owners',
          icon: <ListIcon type="owners" />,
          selected: safeAction === 'settings' && safeSubaction === 'owners',
          href: `${matchSafeWithAddress?.url}/settings/owners`,
        },
        {
          label: 'Policies',
          icon: <ListIcon type="requiredConfirmations" />,
          selected: safeAction === 'settings' && safeSubaction === 'policies',
          href: `${matchSafeWithAddress?.url}/settings/policies`,
        },
        {
          disabled: !isSpendingLimitEnabled,
          label: 'Spending Limit',
          icon: <ListIcon type="fuelIndicator" />,
          selected: safeAction === 'settings' && safeSubaction === 'spending-limit',
          href: `${matchSafeWithAddress?.url}/settings/spending-limit`,
        },
        {
          label: 'Advanced',
          icon: <ListIcon type="settingsTool" />,
          selected: safeAction === 'settings' && safeSubaction === 'advanced',
          href: `${matchSafeWithAddress?.url}/settings/advanced`,
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
