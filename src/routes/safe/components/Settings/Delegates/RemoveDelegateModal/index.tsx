import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'
import GnoForm from 'src/components/forms/GnoForm'

interface RemoveDelegateModalProps {
  delegateToDelete: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (address: string) => void
}

export const RemoveDelegateModal = ({
  delegateToDelete,
  isOpen,
  onClose,
  onSubmit,
}: RemoveDelegateModalProps): ReactElement => {
  const handleDeleteEntrySubmit = () => {
    onSubmit(delegateToDelete)
  }

  return (
    <Modal description="Remove delegate" handleClose={onClose} open={isOpen} title="Remove delegate">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title>Remove delegate</Modal.Header.Title>
      </Modal.Header>
      <GnoForm onSubmit={handleDeleteEntrySubmit}>
        {() => (
          <>
            <Modal.Body>
              <Text size="xl">
                This action will remove{' '}
                <Text size="xl" strong as="span">
                  {delegateToDelete}
                </Text>{' '}
                from the Safe delegates list.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Footer.Buttons
                cancelButtonProps={{ onClick: onClose }}
                confirmButtonProps={{ color: 'error', text: 'Delete' }}
              />
            </Modal.Footer>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}
