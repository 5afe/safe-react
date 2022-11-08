import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import Button from 'src/components/layout/Button'
import { addressBookState } from 'src/logic/addressBook/store/selectors'
import { SafeRecordWithNames, safesWithNamesAsList } from 'src/logic/safe/store/selectors'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { isValidAddress } from 'src/utils/isValidAddress'

// Returns address book data in the format of web-core
const parseAddressBook = (addressBook: AddressBookState) => {
  const newAb = addressBook.reduce((acc, { address, name, chainId }) => {
    if (!name || !address || !isValidAddress(address)) {
      return acc
    }
    acc[chainId] = acc[chainId] || {}
    acc[chainId][address] = name
    return acc
  }, {})

  return Object.keys(newAb).length > 0 ? newAb : {}
}

// Returns added safe data in the format of web-core
const parseAddedSafes = (safes: SafeRecordWithNames[]) => {
  const newAddedSafes = {}

  for (const safe of safes) {
    if (!safe.chainId) {
      continue
    }

    if (!newAddedSafes[safe.chainId]) {
      newAddedSafes[safe.chainId] = {}
    }

    newAddedSafes[safe.chainId][safe.address] = {
      owners: safe.owners,
      threshold: safe.threshold,
      ethBalance: safe.ethBalance,
    }
  }

  return newAddedSafes
}

const DataExport = (): ReactElement => {
  const addressBook = useSelector(addressBookState)
  const safes = useSelector(safesWithNamesAsList)

  const handleExport = () => {
    const filename = `safe-data-${new Date().toISOString().slice(0, 10)}.json`

    const ABData = parseAddressBook(addressBook)
    const safesData = parseAddedSafes(safes)

    const data = JSON.stringify({
      SAFE_v2__addedSafes: safesData,
      SAFE_v2__addressBook: ABData,
    })

    const blob = new Blob([data], { type: 'text/json' })
    const link = document.createElement('a')

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
    link.dispatchEvent(new MouseEvent('click'))
  }

  return (
    <Button onClick={handleExport} color="primary" size="small" variant="outlined">
      Download
    </Button>
  )
}

export default DataExport
