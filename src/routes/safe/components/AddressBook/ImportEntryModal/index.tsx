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
  'text/csv',
]

const ImportEntryModalComponent = ({ importEntryModalHandler, isOpen, onClose }) => {
  const [csvLoaded, setCsvLoaded] = useState(false)
  const [importError, setImportError] = useState('')
  const [entryList, setEntryList] = useState<AddressBookEntry[]>([])

  const handleImportEntrySubmit = () => {
    importEntryModalHandler(entryList)
  }

  const handleOnDrop = (data, file) => {
    const slicedData = data.slice(1)

    const fileError = validateFile(file)
    if (fileError) {
      setImportError(fileError)
      return
    }

    const dataError = validateCsvData(slicedData)
    if (dataError) {
      setImportError(dataError)
      return
    }

    const formatedList = slicedData.map((entry) => {
      const address = entry.data[0].toLowerCase()
      return { address: getWeb3().utils.toChecksumAddress(address), name: entry.data[1] }
    })
    setEntryList(formatedList)
    setImportError('')
    setCsvLoaded(true)
  }

  const validateFile = (file) => {
    if (!IMPORT_SUPPORTED_FORMATS.includes(file.type)) {
      return WRONG_FILE_EXTENSION_ERROR
    }

    if (file.size >= FILE_BYTES_LIMIT) {
      return FILE_SIZE_TOO_BIG
    }

    return
  }

  const validateCsvData = (data) => {
    for (let index = 0; index < data.length; index++) {
      const entry = data[index]
      if (!entry.data[0] || !entry.data[1]) {
        return `Invalid amount of columns on row ${index + 2}`
      }
      // Verify address properties
      const address = entry.data[0].toLowerCase()
      try {
        checksumAddress(address)
      } catch (error) {
        return `Invalid address on row ${index + 2}`
      }
      return
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
