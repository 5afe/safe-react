// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import GnoForm from '~/components/forms/GnoForm'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Modal from '~/components/Modal'
import { styles } from './style'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const DELETE_ENTRY_BTN_ID = 'delete-entry-btn-id'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  deleteEntryModalHandler: Function,
  entryToDelete: AddressBookEntryType,
}

const DeleteEntryModalComponent = ({ onClose, isOpen, classes, entryToDelete, deleteEntryModalHandler }: Props) => {
  const handleDeleteEntrySubmit = values => {
    deleteEntryModalHandler(values, entryToDelete.index)
  }

  return (
    <Modal
      title="Delete entry"
      description="Delete entry"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Delete Entry
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
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
              <Button minWidth={140} minHeight={42} onClick={onClose} className={classes.buttonCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                minWidth={140}
                minHeight={42}
                color="primary"
                testId={DELETE_ENTRY_BTN_ID}
                className={classes.buttonDelete}
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
