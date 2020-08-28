import React, { useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { ListItemType } from 'src/components/List'
import ListIcon from 'src/components/List/ListIcon'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

const useSidebarItems = (): ListItemType[] => {
  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const matchSafeWithAction = useRouteMatch({ path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction` }) as {
    url: string
    params: Record<string, string>
  }

  const sidebarItems = useMemo((): ListItemType[] => {
    if (!matchSafe || !matchSafeWithAddress) {
      return []
    }

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
      {
        label: 'Apps',
        icon: <ListIcon type="apps" />,
        selected: matchSafeWithAction?.params.safeAction === 'apps',
        href: `${matchSafeWithAddress?.url}/apps`,
      },
      {
        label: 'Settings',
        icon: <ListIcon type="settings" />,
        selected: matchSafeWithAction?.params.safeAction === 'settings',
        href: `${matchSafeWithAddress?.url}/settings`,
      },
    ]
  }, [matchSafe, matchSafeWithAction, matchSafeWithAddress])

  return sidebarItems
}

export { useSidebarItems }
