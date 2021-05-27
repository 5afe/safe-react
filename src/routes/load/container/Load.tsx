import React, { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

import Layout from 'src/routes/load/components/Layout'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { FIELD_LOAD_ADDRESS } from 'src/routes/load/components/fields'

import Page from 'src/components/layout/Page'
import { saveSafes, loadStoredSafes } from 'src/logic/safe/utils'
import { getAccountsFrom, getNamesFrom } from 'src/routes/open/utils/safeDataExtractor'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { history } from 'src/store'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { checksumAddress } from 'src/utils/checksumAddress'
import { networkSelector, providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'

export const loadSafe = async (safeAddress: string, addSafe: (safe: SafeRecordProps) => void): Promise<void> => {
  const safeProps = await buildSafe(safeAddress)

  const storedSafes = (await loadStoredSafes()) || {}

  storedSafes[safeAddress] = safeProps

  await saveSafes(storedSafes)
  await addSafe(safeProps)
}

interface ReviewSafeCreationValues {
  confirmations: string
  name: string
  owner0Address: string
  owner0Name: string
  safeCreationSalt: number
}

interface LoadForm {
  name: string
  address: string
  threshold: string
  owner0Address: string
  owner0Name: string
}

export type LoadFormValues = ReviewSafeCreationValues | LoadForm

const Load = (): ReactElement => {
  const dispatch = useDispatch()
  const provider = useSelector(providerNameSelector)
  const network = useSelector(networkSelector)
  const userAddress = useSelector(userAccountSelector)

  const addSafeHandler = async (safe: SafeRecordProps) => {
    await dispatch(addOrUpdateSafe(safe))
  }
  const onLoadSafeSubmit = async (values: LoadFormValues) => {
    let safeAddress = values[FIELD_LOAD_ADDRESS]

    if (!safeAddress) {
      console.error('failed to add Safe address', JSON.stringify(values))
      return
    }

    const ownersNames = getNamesFrom(values)
    const ownersAddresses = getAccountsFrom(values)

    const owners = ownersAddresses.map((address, index) =>
      makeAddressBookEntry({
        address,
        name: ownersNames[index],
      }),
    )
    const safe = makeAddressBookEntry({ address: safeAddress, name: values.name })
    await dispatch(addressBookSafeLoad([...owners, safe]))

    try {
      safeAddress = checksumAddress(safeAddress)
      await loadSafe(safeAddress, addSafeHandler)

      const url = `${SAFELIST_ADDRESS}/${safeAddress}/balances`
      history.push(url)
    } catch (error) {
      console.error('Error while loading the Safe', error)
    }
  }

  return (
    <Page>
      <Layout
        onLoadSafeSubmit={onLoadSafeSubmit}
        network={ETHEREUM_NETWORK[network]}
        userAddress={userAddress}
        provider={provider}
      />
    </Page>
  )
}

export default Load
