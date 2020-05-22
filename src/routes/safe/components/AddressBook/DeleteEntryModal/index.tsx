import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'

import { styles } from './style'

import Modal from 'src/components/Modal'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

export const DELETE_ENTRY_BTN_ID = 'delete-entry-btn-id'

const DeleteEntryModalComponent = ({ classes, deleteEntryModalHandler, entryToDelete, isOpen, onClose }) => {
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

const DeleteEntryModal = withStyles(styles as any)(DeleteEntryModalComponent)

export default DeleteEntryModal
