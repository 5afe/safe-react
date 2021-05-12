import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

import { styles } from './style'
import { Text } from '@gnosis.pm/safe-react-components'
import { Modal } from 'src/components/Modal'
import Row from 'src/components/layout/Row'
import { CSVReader } from 'react-papaparse'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const IMPORT_ENTRY_BTN_ID = 'import-entry-btn-id'

const ImportEntryModalComponent = ({ importEntryModalHandler, isOpen, onClose }) => {
  const [csvLoaded, setCsvLoaded] = useState(false)
  const [addressList, setAddressList] = useState<AddressBookEntry[]>([])

  const handleImportEntrySubmit = () => {
    importEntryModalHandler(addressList)
  }

  const handleOnDrop = (data) => {
    setCsvLoaded(true)
    const list = data.map((entry) => {
      return {
        address: entry.data[0],
        name: entry.data[1],
      }
    })
    setAddressList(list.slice(1))
  }

  const handleOnError = (err) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {
    setCsvLoaded(false)
    console.log(data)
  }

  return (
    <Modal description="Import Entries" handleClose={onClose} open={isOpen} title="Import Entries">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title>Import Addresbook</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body>
        <Row margin="md">
          <Text size="xl">Only Name-Address, comma separeted CSV files are allowed</Text>
          <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton onRemoveFile={handleOnRemoveFile}>
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: () => onClose() }}
          confirmButtonProps={{
            color: 'primary',
            disabled: !csvLoaded,
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
