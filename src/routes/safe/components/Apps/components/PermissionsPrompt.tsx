import { PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'

interface PermissionsPromptProps {
  origin: string
  requestId: string
  onCancel: (requestId: string) => void
  onAccept: (origin: string, requestId: string) => void
  isOpen: boolean
  permissions: PermissionRequest[]
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
      <Modal.Header>
        <Modal.Header.Title>Requested permissions</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body>
        <Text size="xl">
          <b>{origin}</b> is requesting permissions for calling:
        </Text>
        <ul>
          {permissions.map((permission, index) => (
            <li key={index}>{Object.keys(permission)[0]}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: () => onCancel(requestId) }}
          confirmButtonProps={{ color: 'error', text: 'Accept', onClick: () => onAccept(origin, requestId) }}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default PermissionsPrompt
