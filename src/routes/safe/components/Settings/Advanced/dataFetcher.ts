import { List, Set } from 'immutable'

export const MODULES_TABLE_ADDRESS_ID = 'address'
export const MODULES_TABLE_ACTIONS_ID = 'actions'

export const getModuleData = (modules: Set<string>): List<{ [MODULES_TABLE_ADDRESS_ID]: string }> => {
  return modules.toList().map((module) => ({
    [MODULES_TABLE_ADDRESS_ID]: module,
  }))
}

interface TableColumn {
  id: string
  order: boolean
  disablePadding: boolean
  label: string
  custom: boolean
  align?: string
}

export const generateColumns = (): List<TableColumn> => {
  const addressColumn: TableColumn = {
    id: MODULES_TABLE_ADDRESS_ID,
    order: false,
    disablePadding: false,
    label: 'Address',
    custom: false,
    align: 'left',
  }

  const actionsColumn: TableColumn = {
    id: MODULES_TABLE_ACTIONS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([addressColumn, actionsColumn])
}
