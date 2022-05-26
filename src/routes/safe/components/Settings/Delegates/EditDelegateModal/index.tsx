import { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, required, validAddressBookName } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'

import { useStyles } from './style'

type EditDelegateModalProps = {
  isOpen: boolean
  onClose: () => void
  delegate: string
  onSubmit: (label: string) => void
}

export const EditDelegateModal = ({ isOpen, onClose, delegate, onSubmit }: EditDelegateModalProps): ReactElement => {
  const classes = useStyles()

  const handleSubmit = ({ label }: { label: string }): void => {
    console.log('submit label', label)
    onSubmit(label)
    onClose()
  }

  return (
    <Modal description="Edit delegate label" handleClose={onClose} open={isOpen} title="Edit delegate label">
      <ModalHeader onClose={onClose} title="Edit delegate label" />
      <Hairline />
      <GnoForm onSubmit={handleSubmit} subscription={{ pristine: true }}>
        {(...args) => {
          const pristine = args[2].pristine
          return (
            <>
              <Block className={classes.container}>
                <Row margin="md">
                  <Field
                    component={TextField}
                    name="label"
                    placeholder="Label"
                    label="Label*"
                    type="text"
                    validate={composeValidators(required, validAddressBookName)}
                  />
                </Row>
                <Row>
                  <Block justify="center">
                    <PrefixedEthHashInfo
                      hash={delegate}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(delegate)}
                    />
                  </Block>
                </Row>
              </Block>
              <GenericModal.Footer>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{ disabled: pristine, text: 'Save' }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </GnoForm>
    </Modal>
  )
}
