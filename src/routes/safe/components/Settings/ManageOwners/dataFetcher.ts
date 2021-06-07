import { List } from 'immutable'

import { TableColumn } from 'src/components/Table/types.d'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

export const OWNERS_TABLE_NAME_ID = 'name'
export const OWNERS_TABLE_ADDRESS_ID = 'address'
export const OWNERS_TABLE_ACTIONS_ID = 'actions'

export type OwnerData = { address: string; name: string }

export const getOwnerData = (owners: AddressBookState): OwnerData[] => {
  return owners.map((owner) => ({
    [OWNERS_TABLE_NAME_ID]: owner.name,
    [OWNERS_TABLE_ADDRESS_ID]: owner.address,
  }))
}

export const generateColumns = (): List<TableColumn> => {
  const nameColumn: TableColumn = {
    id: OWNERS_TABLE_NAME_ID,
    order: false,
    formatTypeSort: (value: string) => value.toLowerCase(),
    disablePadding: false,
    label: 'Name',
    width: 150,
    custom: false,
    align: 'left',
  }

  const addressColumn: TableColumn = {
    id: OWNERS_TABLE_ADDRESS_ID,
    order: false,
    disablePadding: false,
    label: 'Address',
    custom: false,
    align: 'left',
  }

  const actionsColumn: TableColumn = {
    id: OWNERS_TABLE_ACTIONS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([nameColumn, addressColumn, actionsColumn])
}
