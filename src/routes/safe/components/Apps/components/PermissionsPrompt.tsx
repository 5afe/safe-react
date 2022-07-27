import { ReactElement } from 'react'
import styled from 'styled-components'
import { PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { Text } from '@gnosis.pm/safe-react-components'

import { Modal } from 'src/components/Modal'
import { Divider } from '@material-ui/core'

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
  onReject: (requestId?: string) => void
  onAccept: (origin: string, requestId: string) => void
}

const PermissionsPrompt = ({
  origin,
  isOpen,
  requestId,
  permissions,
  onReject,
  onAccept,
}: PermissionsPromptProps): ReactElement => {
  return (
    <Modal
      description="Requested permissions"
      handleClose={() => onReject()}
      open={isOpen}
      title="Requested permissions"
      style={{ top: '25%' }}
    >
      <Container>
        <Modal.Header onClose={() => onReject()}>
          <Modal.Header.Title>Permissions Request</Modal.Header.Title>
        </Modal.Header>
        <Divider />
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
              onClick: () => onReject(requestId),
            }}
            confirmButtonProps={{ text: 'Accept', color: 'primary', onClick: () => onAccept(origin, requestId) }}
          />
        </Modal.Footer>
      </Container>
    </Modal>
  )
}

const Container = styled.div`
  .modal-body {
    min-height: auto;
  }

  .modal-footer {
    border-top: 0;
  }
`

export default PermissionsPrompt
