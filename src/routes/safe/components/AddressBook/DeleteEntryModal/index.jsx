// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'

import { styles } from './style'

import Modal from '~/components/Modal'
import GnoForm from '~/components/forms/GnoForm'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const DELETE_ENTRY_BTN_ID = 'delete-entry-btn-id'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  deleteEntryModalHandler: Function,
  entryToDelete: AddressBookEntryType,
}

const DeleteEntryModalComponent = ({ classes, deleteEntryModalHandler, entryToDelete, isOpen, onClose }: Props) => {
  const handleDeleteEntrySubmit = (values) => {
    deleteEntryModalHandler(values, entryToDelete.index)
  }

  return (
    <Modal
      description="Delete entry"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
      title="Delete entry"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Delete Entry
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleDeleteEntrySubmit}>
        {() => (
          <>
            <Block className={classes.container}>
              <Row margin="md">
                <Paragraph>This action will delete {entryToDelete.entry.name} from the address book.</Paragraph>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button className={classes.buttonCancel} minHeight={42} minWidth={140} onClick={onClose}>
                Cancel
              </Button>
              <Button
                className={classes.buttonDelete}
                color="primary"
                minHeight={42}
                minWidth={140}
                testId={DELETE_ENTRY_BTN_ID}
                type="submit"
                variant="contained"
              >
                Delete
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

const DeleteEntryModal = withStyles(styles)(DeleteEntryModalComponent)

export default DeleteEntryModal
