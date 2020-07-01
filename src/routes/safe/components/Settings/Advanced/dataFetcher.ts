import { List } from 'immutable'

export const MODULES_TABLE_ADDRESS_ID = 'address'
export const MODULES_TABLE_ACTIONS_ID = 'actions'

export const getModuleData = (
  modulesList: List<[string, string]>,
): List<{ [MODULES_TABLE_ADDRESS_ID]: [string, string] }> => {
  return modulesList.map((modules) => ({
    [MODULES_TABLE_ADDRESS_ID]: modules,
  }))
}

interface TableColumn {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  custom: boolean
  disablePadding: boolean
  id: string
  label: string
  order: boolean
  width?: number
}

export const generateColumns = (): List<TableColumn> => {
  const addressColumn: TableColumn = {
    align: 'left',
    custom: false,
    disablePadding: false,
    id: MODULES_TABLE_ADDRESS_ID,
    label: 'Address',
    order: false,
  }

  const actionsColumn: TableColumn = {
    custom: true,
    disablePadding: false,
    id: MODULES_TABLE_ACTIONS_ID,
    label: '',
    order: false,
  }

  return List([addressColumn, actionsColumn])
}
