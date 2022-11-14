import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'
import GnoForm from 'src/components/forms/GnoForm'
import { Entry } from 'src/routes/safe/components/AddressBook'
import styled from 'styled-components'

export const DELETE_ENTRY_BTN_ID = 'delete-entry-btn-id'

interface DeleteEntryModalProps {
  deleteEntryModalHandler: () => void
  entryToDelete: Entry
  isOpen: boolean
  onClose: () => void
}

export const DeleteEntryModal = ({
  deleteEntryModalHandler,
  entryToDelete,
  isOpen,
  onClose,
}: DeleteEntryModalProps): ReactElement => {
  const handleDeleteEntrySubmit = () => {
    deleteEntryModalHandler()
  }

  return (
    <Modal description="Delete entry" handleClose={onClose} open={isOpen} title="Delete entry">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title>Delete entry</Modal.Header.Title>
      </Modal.Header>
      <GnoForm onSubmit={handleDeleteEntrySubmit}>
        {() => (
          <>
            <Modal.Body>
              <Text size="xl" color="primary">
                This action will delete{' '}
                <Text size="xl" color='primary' strong as="span">
                  {entryToDelete.entry.name}
                </Text>{' '}
                from the address book.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Footer.Buttons
                cancelButtonProps={{ onClick: onClose }}
                confirmButtonProps={{ color: 'primary', testId: DELETE_ENTRY_BTN_ID, text: 'Delete' }}
              />

              {/* <Button onClick={onClose}>Cancel</Button>
              <Button confirmButtonProps={{ color: 'primary', testId: DELETE_ENTRY_BTN_ID, text: 'Delete' }} >Delete</Button> */}
              
            </Modal.Footer>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}
