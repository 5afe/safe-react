// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import AddressInput from '~/components/forms/AddressInput'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { type Owner } from '~/routes/safe/store/models/owner'
import {
  composeValidators,
  required,
  minMaxLength,
  uniqueAddress,
} from '~/components/forms/validator'
import { styles } from './style'

export const ADD_OWNER_NAME_INPUT_TEST_ID = 'add-owner-name-input'
export const ADD_OWNER_ADDRESS_INPUT_TEST_ID = 'add-owner-address-testid'
export const ADD_OWNER_NEXT_BTN_TEST_ID = 'add-owner-next-btn'

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  },
}

type Props = {
  onClose: () => void,
  classes: Object,
  onSubmit: Function,
  owners: List<Owner>,
}

const OwnerForm = ({
  classes, onClose, onSubmit, owners,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const ownerDoesntExist = uniqueAddress(owners.map(o => o.address))

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit} formMutators={formMutators}>
        {(...args) => {
          const mutators = args[3]

          return (
            <React.Fragment>
              <Block className={classes.formContainer}>
                <Row margin="md">
                  <Paragraph>Add a new owner to the active Safe</Paragraph>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <Field
                      name="ownerName"
                      component={TextField}
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                      placeholder="Owner name*"
                      text="Owner name*"
                      className={classes.addressInput}
                      testId={ADD_OWNER_NAME_INPUT_TEST_ID}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <AddressInput
                      name="ownerAddress"
                      validators={[ownerDoesntExist]}
                      placeholder="Owner address*"
                      text="Owner address*"
                      className={classes.addressInput}
                      fieldMutator={mutators.setOwnerAddress}
                      testId={ADD_OWNER_ADDRESS_INPUT_TEST_ID}
                    />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button className={classes.button} minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={classes.button}
                  variant="contained"
                  minWidth={140}
                  color="primary"
                  testId={ADD_OWNER_NEXT_BTN_TEST_ID}
                >
                  Next
                </Button>
              </Row>
            </React.Fragment>
          )
        }}
      </GnoForm>
    </React.Fragment>
  )
}

export default withStyles(styles)(OwnerForm)
