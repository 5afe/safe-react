import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { isFeatureEnabled } from 'src/config'
import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { currentSafeFeaturesEnabled } from 'src/logic/safe/store/selectors'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const safeAppsEnabled = isFeatureEnabled(FEATURES.SAFE_APPS)
  const isCollectiblesEnabled = isFeatureEnabled(FEATURES.ERC721)
  const isSpendingLimitEnabled = isFeatureEnabled(FEATURES.SPENDING_LIMIT)
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

    const settingsItem = {
      label: 'Settings',
      icon: <ListIcon type="settings" />,
      selected: matchSafeWithAction?.params.safeAction === 'settings',
      href: `${matchSafeWithAddress?.url}/settings/details`,
      subItems: [
        {
          label: 'Safe Details',
          icon: <ListIcon type="info" />,
          selected:
            matchSafeWithAction?.params.safeAction === 'settings' &&
            matchSafeWithAction?.params.safeSubaction === 'details',
          href: `${matchSafeWithAddress?.url}/settings/details`,
        },
        {
          label: 'Owners',
          icon: <ListIcon type="owners" />,
          selected:
            matchSafeWithAction?.params.safeAction === 'settings' &&
            matchSafeWithAction?.params.safeSubaction === 'owners',
          href: `${matchSafeWithAddress?.url}/settings/owners`,
        },
        {
          label: 'Policies',
          icon: <ListIcon type="requiredConfirmations" />,
          selected:
            matchSafeWithAction?.params.safeAction === 'settings' &&
            matchSafeWithAction?.params.safeSubaction === 'policies',
          href: `${matchSafeWithAddress?.url}/settings/policies`,
        },
        {
          label: 'SpendingLimit',
          icon: <ListIcon type="fuelIndicator" />,
          selected:
            matchSafeWithAction?.params.safeAction === 'settings' &&
            matchSafeWithAction?.params.safeSubaction === 'spending-limit',
          href: `${matchSafeWithAddress?.url}/settings/spending-limit`,
        },
        {
          label: 'Advanced',
          icon: <ListIcon type="settingsTool" />,
          selected:
            matchSafeWithAction?.params.safeAction === 'settings' &&
            matchSafeWithAction?.params.safeSubaction === 'advanced',
          href: `${matchSafeWithAddress?.url}/settings/advanced`,
        },
      ],
    }

    const safeSidebar = safeAppsEnabled
      ? [
          {
            label: 'Apps',
            icon: <ListIcon type="apps" />,
            selected: matchSafeWithAction?.params.safeAction === 'apps',
            href: `${matchSafeWithAddress?.url}/apps`,
          },
          settingsItem,
        ]
      : [settingsItem]

    return [
      {
        label: 'ASSETS',
        icon: <ListIcon type="assets" />,
        selected: matchSafeWithAction?.params.safeAction === 'balances',
        href: `${matchSafeWithAddress?.url}/balances`,
        subItems: [
          {
            label: 'Coins',
            icon: <ListIcon type="assets" />,
            selected: matchSafeWithAction?.params.safeAction === 'balances',
            href: `${matchSafeWithAddress?.url}/balances`,
          },
          {
            label: 'Collectibles',
            icon: <ListIcon type="collectibles" />,
            selected:
              matchSafeWithAction?.params.safeAction === 'balances' &&
              matchSafeWithAction?.params.safeSubaction === 'collectibles',
            href: `${matchSafeWithAddress?.url}/balances/collectibles`,
          },
        ],
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: matchSafeWithAction?.params.safeAction === 'transactions',
        href: `${matchSafeWithAddress?.url}/transactions`,
      },
      {
        label: 'ADDRESS BOOK',
        icon: <ListIcon type="addressBook" />,
        selected: matchSafeWithAction?.params.safeAction === 'address-book',
        href: `${matchSafeWithAddress?.url}/address-book`,
      },
      ...safeSidebar,
    ]
  }, [matchSafe, matchSafeWithAction, matchSafeWithAddress, safeAppsEnabled, featuresEnabled])
}

export { useSidebarItems }
