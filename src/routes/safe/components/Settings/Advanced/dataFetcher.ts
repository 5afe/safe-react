import { List } from 'immutable'
import { TableColumn } from 'src/routes/safe/components/tableTypes'
import { ModulePair } from 'src/routes/safe/store/models/safe'

export const MODULES_TABLE_ADDRESS_ID = 'address'
export const MODULES_TABLE_ACTIONS_ID = 'actions'

export const getModuleData = (modulesList: List<ModulePair>): List<{ [MODULES_TABLE_ADDRESS_ID]: ModulePair }> => {
  return modulesList.map((modules) => ({
    [MODULES_TABLE_ADDRESS_ID]: modules,
  }))
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
