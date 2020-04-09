// @flow
import { ManageListModal } from '@gnosis/safe-react-components'
import React, { useState } from 'react'

//import { getAppInfoFromUrl, staticAppsList } from './utils'

import ButtonLink from '~/components/layout/ButtonLink'
import appsIconSvg from '~/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

const ManageApps = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([
    {
      id: '1',
      iconUrl: 'someUrl',
      name: 'name 1',
      description: 'description 1',
      checked: true,
    },
    {
      id: '2',
      iconUrl: 'someUrl2',
      name: 'name 2',
      description: 'description 2',
      checked: true,
    },
    {
      id: '3',
      iconUrl: 'someUrl3',
      name: 'name 3',
      description: 'description 3',
      checked: true,
    },
  ])

  const onItemToggle = (itemId: string, checked: boolean) => {
    const copy = [...items]
    const localItem = copy.find((i) => i.id === itemId)
    if (!localItem) {
      return
    }
    localItem.checked = checked
    setItems(copy)
  }

  return (
    <>
      <ButtonLink onClick={() => setIsOpen(!isOpen)} size="lg" testId="manage-tokens-btn">
        Manage Apps
      </ButtonLink>
      {isOpen && (
        <ManageListModal
          addButtonLabel="Add custom app"
          defaultIconUrl={appsIconSvg}
          formBody={<div>some form</div>}
          itemList={items}
          onClose={() => setIsOpen(false)}
          onItemToggle={onItemToggle}
          onSubmitForm={() => {}}
        />
      )}
    </>
  )
}

export default ManageApps
