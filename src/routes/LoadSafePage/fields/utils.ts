import { AddressBookMap } from 'src/logic/addressBook/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
  LoadSafeFormValues,
} from './loadFields'
import { getSDKWeb3Adapter } from '../../../logic/wallets/getWeb3'

export function getLoadSafeName(formValues: LoadSafeFormValues, addressBook: AddressBookMap): string {
  let safeAddress = formValues[FIELD_LOAD_SAFE_ADDRESS] || ''
  safeAddress = safeAddress && checksumAddress(safeAddress)

  return (
    formValues[FIELD_LOAD_CUSTOM_SAFE_NAME] ||
    addressBook[safeAddress]?.name ||
    formValues[FIELD_LOAD_SUGGESTED_SAFE_NAME]
  )
}

export async function getOwnerName(owner: string, signer: string): Promise<string> {
  const sdkWeb3Adapter = getSDKWeb3Adapter(signer)
  try {
    const ensName = await sdkWeb3Adapter.ensReverseLookup(owner)
    return ensName ?? ''
  } catch (error) {
    return ''
  }
}
