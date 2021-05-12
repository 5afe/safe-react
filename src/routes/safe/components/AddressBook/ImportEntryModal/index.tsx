import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useState } from 'react'

import { styles } from './style'

import Modal from 'src/components/Modal'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { CSVReader } from 'react-papaparse'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const IMPORT_ENTRY_BTN_ID = 'import-entry-btn-id'

const ImportEntryModalComponent = ({ classes, importEntryModalHandler, isOpen, onClose }) => {
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
    <Modal
      description="Import Entries"
      handleClose={onClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title="Import Entries"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Import Entries
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleImportEntrySubmit}>
        {() => (
          <>
            <Block className={classes.container}>
              <Row margin="md">
                <Paragraph>Only Name-Address, comma separeted CSV files are allowed</Paragraph>
                <CSVReader
                  onDrop={handleOnDrop}
                  onError={handleOnError}
                  addRemoveButton
                  onRemoveFile={handleOnRemoveFile}
                >
                  <span>Drop CSV file here or click to upload.</span>
                </CSVReader>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button className={classes.buttonCancel} minHeight={42} minWidth={140} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                minHeight={42}
                minWidth={140}
                testId={IMPORT_ENTRY_BTN_ID}
                type="submit"
                variant="contained"
                disabled={!csvLoaded}
              >
                Import
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

const ImportEntryModal = withStyles(styles as any)(ImportEntryModalComponent)

export default ImportEntryModal
