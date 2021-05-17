import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

import { styles } from './style'
import { Text } from '@gnosis.pm/safe-react-components'
import { Modal } from 'src/components/Modal'
import Row from 'src/components/layout/Row'
import { CSVReader } from 'react-papaparse'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { checksumAddress } from 'src/utils/checksumAddress'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

const WRONG_FILE_EXTENSION_ERROR = 'Only CSV files are allowed'
const FILE_SIZE_TOO_BIG = 'The size of the file is over 1 MB'
const FILE_BYTES_LIMIT = 1000000
const IMPORT_SUPPORTED_FORMATS = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '	text/csv',
]

const ImportEntryModalComponent = ({ importEntryModalHandler, isOpen, onClose }) => {
  const [csvLoaded, setCsvLoaded] = useState(false)
  const [importError, setImportError] = useState('')
  const [entryList, setEntryList] = useState<AddressBookEntry[]>([])

  const handleImportEntrySubmit = () => {
    importEntryModalHandler(entryList)
  }

  const handleOnDrop = (data, file) => {
    if (!IMPORT_SUPPORTED_FORMATS.includes(file.type)) {
      setImportError(WRONG_FILE_EXTENSION_ERROR)
      return
    }

    if (file.size >= FILE_BYTES_LIMIT) {
      setImportError(FILE_SIZE_TOO_BIG)
      return
    }
    setCsvLoaded(true)
    const list: { address: string; name: string }[] = []
    const slicedData = data.slice(1)
    setImportError('')
    for (let index = 0; index < slicedData.length; index++) {
      const entry = slicedData[index]
      if (entry.data.length !== 2) {
        setImportError(`Invalid amount of columns on row ${index + 2}`)
        break
      }
      if (typeof entry.data[0] !== 'string' || typeof entry.data[1] !== 'string') {
        setImportError(`Invalid entry on row ${index + 2}`)
        break
      }
      // Verify address properties
      const address = entry.data[0].toLowerCase()
      try {
        checksumAddress(address)
      } catch (error) {
        setImportError(`Invalid address on row ${index + 2}`)
        break
      }
      list.push({
        address: getWeb3().utils.toChecksumAddress(address),
        name: entry.data[1],
      })
    }
    if (importError === '') {
      setEntryList(list)
    }
  }

  const handleOnError = (error) => {
    setImportError(error.message)
  }

  const handleOnRemoveFile = () => {
    setCsvLoaded(false)
    setImportError('')
  }

  const handleClose = () => {
    setCsvLoaded(false)
    setEntryList([])
    setImportError('')
    onClose()
  }

  return (
    <Modal description="Import Entries" handleClose={handleClose} open={isOpen} title="Import Entries">
      <Modal.Header onClose={handleClose}>
        <Modal.Header.Title>Import Addresbook</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body>
        <Row margin="md">
          <Text size="xl">Only Name-Address, comma separeted CSV files are allowed</Text>
          <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton onRemoveFile={handleOnRemoveFile}>
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
          {importError !== '' && <Text size="xl">{importError}</Text>}
          {csvLoaded && importError === '' && (
            <Text size="xl">{`You're about to import ${entryList.length} entries to your address book`}</Text>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: () => handleClose() }}
          confirmButtonProps={{
            color: 'primary',
            disabled: !csvLoaded || importError !== '',
            onClick: handleImportEntrySubmit,
            text: 'Import',
          }}
        />
      </Modal.Footer>
    </Modal>
  )
}

const ImportEntryModal = withStyles(styles as any)(ImportEntryModalComponent)

export default ImportEntryModal
