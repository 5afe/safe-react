import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { composeValidators, mustBeAddressHash, required } from 'src/components/forms/validator'

import { useStyles } from './style'

type DelegateEntry = {
  address: string
  label: string
}

const formMutators = {
  setDelegateAddress: (args, state, utils) => {
    utils.changeValue(state, 'address', () => args[0])
  },
  setDelegateLabel: (args, state, utils) => {
    utils.changeValue(state, 'label', () => args[0])
  },
}

type AddDelegateModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (entry: DelegateEntry) => void
}

export const AddDelegateModal = ({ isOpen, onClose, onSubmit }: AddDelegateModalProps): ReactElement => {
  const classes = useStyles()

  const onFormSubmitted = (values: DelegateEntry) => {
    onSubmit(values)
  }

  return (
    <Modal description="Add a new Safe delegate" handleClose={onClose} open={isOpen} title="Add a delegate">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title>{'Add a delegate'}</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body withoutPadding>
        <GnoForm formMutators={formMutators} onSubmit={onFormSubmitted}>
          {(...args) => {
            const formState = args[2]

            return (
              <>
                <Block className={classes.container}>
                  <Row margin="md">
                    <Col xs={11}>
                      <Field
                        component={TextField}
                        name="address"
                        placeholder="Delegate address"
                        label="Delegate*"
                        type="text"
                        validate={composeValidators(required, mustBeAddressHash)}
                      />
                    </Col>
                  </Row>
                  <Row margin="md">
                    <Col xs={11}>
                      <Field
                        component={TextField}
                        name="label"
                        placeholder="Label"
                        label="Label*"
                        type="text"
                        validate={required}
                      />
                    </Col>
                  </Row>
                </Block>
                <Modal.Footer>
                  <Modal.Footer.Buttons
                    cancelButtonProps={{ onClick: onClose }}
                    confirmButtonProps={{
                      disabled: !formState.valid,
                      text: 'Add',
                    }}
                  />
                </Modal.Footer>
              </>
            )
          }}
        </GnoForm>
      </Modal.Body>
    </Modal>
  )
}
