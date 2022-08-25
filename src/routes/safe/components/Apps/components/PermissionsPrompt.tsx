import { ReactElement } from 'react'
import styled from 'styled-components'
import { PermissionRequest } from '@gnosis.pm/safe-apps-sdk/dist/src/types/permissions'
import { Text } from '@gnosis.pm/safe-react-components'
import { Divider } from '@material-ui/core'

import { Modal } from 'src/components/Modal'
import { SAFE_PERMISSIONS_TEXTS } from 'src/routes/safe/components/Apps/hooks/permissions'

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
      handleClose={onReject}
      open={isOpen}
      title="Requested permissions"
      style={{ top: '25%' }}
    >
      <Container>
        <Modal.Header onClose={onReject}>
          <Modal.Header.Title>Permissions Request</Modal.Header.Title>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <Text size="xl">
            <b>{origin}</b> is requesting permissions for:
          </Text>
          <ul>
            {permissions.map((permission, index) => (
              <li key={index}>
                <Text size="xl">{SAFE_PERMISSIONS_TEXTS[Object.keys(permission)[0]].description}</Text>
              </li>
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
