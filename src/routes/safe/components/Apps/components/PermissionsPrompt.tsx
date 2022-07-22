import { PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'

const DESCRIPTIONS = {
  requestAddressBook: 'Access to your address book',
}

const getDescription = (permission: PermissionRequest): string => {
  const method = Object.keys(permission)[0]
  return DESCRIPTIONS[method] || method
}

interface PermissionsPromptProps {
  origin: string
  isOpen: boolean
  requestId: string
  permissions: PermissionRequest[]
  onCancel: (requestId: string) => void
  onAccept: (origin: string, requestId: string) => void
}

const PermissionsPrompt = ({
  origin,
  requestId,
  onCancel,
  onAccept,
  isOpen,
  permissions,
}: PermissionsPromptProps): ReactElement => {
  return (
    <Modal
      description="Requested permissions"
      handleClose={() => onCancel(requestId)}
      open={isOpen}
      title="Requested permissions"
    >
      <Modal.Header onClose={() => onCancel(requestId)}>
        <Modal.Header.Title>Permissions Request</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body>
        <Text size="xl">
          <b>{origin}</b> is requesting permissions for:
        </Text>
        <ul>
          {permissions.map((permission, index) => (
            <li key={index}>{getDescription(permission)}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{
            text: 'Reject',
            color: 'error',
            variant: 'contained',
            onClick: () => onCancel(requestId),
          }}
          confirmButtonProps={{ text: 'Accept', color: 'primary', onClick: () => onAccept(origin, requestId) }}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default PermissionsPrompt
