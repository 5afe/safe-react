// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
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
  mustBeEthereumAddress,
  minMaxLength,
  uniqueAddress,
} from '~/components/forms/validator'
import { styles } from './style'

export const ADD_OWNER_NAME_INPUT_TESTID = 'add-owner-name-input'
export const ADD_OWNER_ADDRESS_INPUT_TESTID = 'add-owner-address-testid'
export const ADD_OWNER_NEXT_BTN_TESTID = 'add-owner-next-btn'

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
      <GnoForm onSubmit={handleSubmit}>
        {() => (
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
                    testId={ADD_OWNER_NAME_INPUT_TESTID}
                  />
                </Col>
              </Row>
              <Row margin="md">
                <Col xs={8}>
                  <Field
                    name="ownerAddress"
                    component={TextField}
                    type="text"
                    validate={composeValidators(required, mustBeEthereumAddress, ownerDoesntExist)}
                    placeholder="Owner address*"
                    text="Owner address*"
                    className={classes.addressInput}
                    testId={ADD_OWNER_ADDRESS_INPUT_TESTID}
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
                testId={ADD_OWNER_NEXT_BTN_TESTID}
              >
                Next
              </Button>
            </Row>
          </React.Fragment>
        )}
      </GnoForm>
    </React.Fragment>
  )
}

export default withStyles(styles)(OwnerForm)
