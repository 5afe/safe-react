import { List } from 'immutable'

export const ADDRESS_BOOK_ROW_ID = 'address-book-row'
export const TX_TABLE_ADDRESS_BOOK_ID = 'idAddressBook'
export const AB_NAME_ID = 'name'
export const AB_ADDRESS_ID = 'address'
export const AB_ADDRESS_ACTIONS_ID = 'actions'
export const EDIT_ENTRY_BUTTON = 'edit-entry-btn'
export const REMOVE_ENTRY_BUTTON = 'remove-entry-btn'
export const SEND_ENTRY_BUTTON = 'send-entry-btn'

export const generateColumns = () => {
  const nameColumn = {
    id: AB_NAME_ID,
    order: false,
    disablePadding: false,
    label: 'Name',
    width: 150,
    custom: false,
    align: 'left',
  }

  const addressColumn = {
    id: AB_ADDRESS_ID,
    order: false,
    disablePadding: false,
    label: 'Address',
    custom: false,
    align: 'left',
  }

  const actionsColumn = {
    id: AB_ADDRESS_ACTIONS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([nameColumn, addressColumn, actionsColumn])
}
