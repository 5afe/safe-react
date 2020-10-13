import React, { useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { useSelector } from 'react-redux'
import { safeFeaturesEnabledSelector } from 'src/logic/safe/store/selectors'

const useSidebarItems = (): ListItemType[] => {
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)
  const safeAppsEnabled = Boolean(featuresEnabled?.includes(FEATURES.SAFE_APPS))
  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const matchSafeWithAction = useRouteMatch({ path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction` }) as {
    url: string
    params: Record<string, string>
  }

  return useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithAddress) {
      return []
    }

    const settingsItem = {
      label: 'Settings',
      icon: <ListIcon type="settings" />,
      selected: matchSafeWithAction?.params.safeAction === 'settings',
      href: `${matchSafeWithAddress?.url}/settings`,
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
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: matchSafeWithAction?.params.safeAction === 'transactions',
        href: `${matchSafeWithAddress?.url}/transactions`,
      },
      {
        label: 'AddressBook',
        icon: <ListIcon type="addressBook" />,
        selected: matchSafeWithAction?.params.safeAction === 'address-book',
        href: `${matchSafeWithAddress?.url}/address-book`,
      },
      ...safeSidebar,
    ]
  }, [matchSafe, matchSafeWithAction, matchSafeWithAddress, safeAppsEnabled])
}

export { useSidebarItems }
