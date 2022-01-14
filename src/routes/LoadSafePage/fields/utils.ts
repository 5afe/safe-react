import { AddressBookMap } from 'src/logic/addressBook/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
  LoadSafeFormValues,
} from './loadFields'
import { FIELD_SAFE_OWNER_ENS_LIST } from '../../CreateSafePage/fields/createSafeFields'

export function getLoadSafeName(formValues: LoadSafeFormValues, addressBook: AddressBookMap): string {
  let safeAddress = formValues[FIELD_LOAD_SAFE_ADDRESS] || ''
  safeAddress = safeAddress && checksumAddress(safeAddress)

  return (
    formValues[FIELD_LOAD_CUSTOM_SAFE_NAME] ||
    addressBook[safeAddress]?.name ||
    formValues[FIELD_LOAD_SUGGESTED_SAFE_NAME]
  )
}

export function getOwnerName(formValues: LoadSafeFormValues, address: string): string {
  return formValues[address] || formValues[FIELD_SAFE_OWNER_ENS_LIST][address]
}
