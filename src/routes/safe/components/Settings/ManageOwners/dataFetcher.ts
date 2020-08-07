import { List } from 'immutable'
import { TableColumn } from 'src/components/Table/types.d'

export const OWNERS_TABLE_NAME_ID = 'name'
export const OWNERS_TABLE_ADDRESS_ID = 'address'
export const OWNERS_TABLE_ACTIONS_ID = 'actions'

export const getOwnerData = (owners) => {
  const rows = owners.map((owner) => ({
    [OWNERS_TABLE_NAME_ID]: owner.name,
    [OWNERS_TABLE_ADDRESS_ID]: owner.address,
  }))

  return rows
}

export const generateColumns = (): List<TableColumn> => {
  const nameColumn: TableColumn = {
    id: OWNERS_TABLE_NAME_ID,
    order: false,
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
