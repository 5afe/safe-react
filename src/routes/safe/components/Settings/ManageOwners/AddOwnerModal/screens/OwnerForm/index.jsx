// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { List } from 'immutable'
import React from 'react'

import { styles } from './style'

import AddressInput from '~/components/forms/AddressInput'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, minMaxLength, required, uniqueAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Owner } from '~/routes/safe/store/models/owner'

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

const OwnerForm = ({ classes, onClose, onSubmit, owners }: Props) => {
  const handleSubmit = values => {
    onSubmit(values)
  }
  const ownerDoesntExist = uniqueAddress(owners.map(o => o.address))

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} onSubmit={handleSubmit}>
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <Block className={classes.formContainer}>
                <Row margin="md">
                  <Paragraph>Add a new owner to the active Safe</Paragraph>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <Field
                      className={classes.addressInput}
                      component={TextField}
                      name="ownerName"
                      placeholder="Owner name*"
                      testId={ADD_OWNER_NAME_INPUT_TEST_ID}
                      text="Owner name*"
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <AddressInput
                      className={classes.addressInput}
                      fieldMutator={mutators.setOwnerAddress}
                      name="ownerAddress"
                      placeholder="Owner address*"
                      testId={ADD_OWNER_ADDRESS_INPUT_TEST_ID}
                      text="Owner address*"
                      validators={[ownerDoesntExist]}
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
                  className={classes.button}
                  color="primary"
                  minWidth={140}
                  testId={ADD_OWNER_NEXT_BTN_TEST_ID}
                  type="submit"
                  variant="contained"
                >
                  Next
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(OwnerForm)
