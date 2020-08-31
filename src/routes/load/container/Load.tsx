import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Layout from 'src/routes/load/components/Layout'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_NAME } from '../components/fields'

import Page from 'src/components/layout/Page'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { SAFES_KEY, saveSafes } from 'src/logic/safe/utils'
import { getNamesFrom, getOwnersFrom } from 'src/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { loadFromStorage } from 'src/utils/storage'
import { SafeOwner, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { List } from 'immutable'
import { checksumAddress } from 'src/utils/checksumAddress'
import { addSafe } from 'src/logic/safe/store/actions/addSafe'
import { networkSelector, providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'

export const loadSafe = async (
  safeName: string,
  safeAddress: string,
  owners: List<SafeOwner>,
  addSafe: (safe: SafeRecordProps) => void,
): Promise<void> => {
  const safeProps = await buildSafe(safeAddress, safeName)
  safeProps.owners = owners

  const storedSafes = (await loadFromStorage(SAFES_KEY)) || {}

  storedSafes[safeAddress] = safeProps

  await saveSafes(storedSafes)
  await addSafe(safeProps)
}

export interface LoadFormValues {
  name: string
  address: string
  threshold: string
}

const Load = (): React.ReactElement => {
  const dispatch = useDispatch()
  const provider = useSelector(providerNameSelector)
  const network = useSelector(networkSelector)
  const userAddress = useSelector(userAccountSelector)

  const addSafeHandler = (safe: SafeRecordProps) => {
    dispatch(addSafe(safe))
  }
  const onLoadSafeSubmit = async (values: LoadFormValues) => {
    let safeAddress = values[FIELD_LOAD_ADDRESS]
    // TODO: review this check. It doesn't seems to be necessary at this point
    if (!safeAddress) {
      console.error('failed to load Safe address', JSON.stringify(values))
      return
    }

    try {
      const safeName = values[FIELD_LOAD_NAME]
      safeAddress = checksumAddress(safeAddress)
      const ownerNames = getNamesFrom(values)

      const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
      const ownerAddresses = await gnosisSafe.methods.getOwners().call()
      const owners = getOwnersFrom(ownerNames, ownerAddresses.slice().sort())

      await loadSafe(safeName, safeAddress, owners, addSafeHandler)

      const url = `${SAFELIST_ADDRESS}/${safeAddress}/balances`
      history.push(url)
    } catch (error) {
      console.error('Error while loading the Safe', error)
    }
  }

  return (
    <Page>
      <Layout onLoadSafeSubmit={onLoadSafeSubmit} network={network} userAddress={userAddress} provider={provider} />
    </Page>
  )
}

export default Load
