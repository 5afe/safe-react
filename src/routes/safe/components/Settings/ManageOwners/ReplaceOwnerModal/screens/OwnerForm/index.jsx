// @flow
import React from 'react'
import classNames from 'classnames/bind'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import AddressInput from '~/components/forms/AddressInput'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Identicon from '~/components/Identicon'
import Link from '~/components/layout/Link'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { type Owner } from '~/routes/safe/store/models/owner'
import {
  composeValidators, required, minMaxLength, uniqueAddress,
} from '~/components/forms/validator'
import { styles } from './style'
import { secondary } from '~/theme/variables'

export const REPLACE_OWNER_NAME_INPUT_TEST_ID = 'replace-owner-name-input'
export const REPLACE_OWNER_ADDRESS_INPUT_TEST_ID = 'replace-owner-address-testid'
export const REPLACE_OWNER_NEXT_BTN_TEST_ID = 'replace-owner-next-btn'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  },
}

type Props = {
  onClose: () => void,
  classes: Object,
  ownerAddress: string,
  ownerName: string,
  onSubmit: Function,
  owners: List<Owner>,
}

const OwnerForm = ({
  classes, onClose, ownerAddress, ownerName, onSubmit, owners,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const ownerDoesntExist = uniqueAddress(owners.map((o) => o.address))

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Replace owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit} formMutators={formMutators}>
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <Block className={classes.formContainer}>
                <Row>
                  <Paragraph>
                    Review the owner you want to replace from the active Safe. Then specify the new owner you want to
                    replace it with:
                  </Paragraph>
                </Row>
                <Row>
                  <Paragraph>Current owner</Paragraph>
                </Row>
                <Row className={classes.owner}>
                  <Col xs={1} align="center">
                    <Identicon address={ownerAddress} diameter={32} />
                  </Col>
                  <Col xs={7}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph size="lg" noMargin weight="bolder">
                        {ownerName}
                      </Paragraph>
                      <Block align="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" noMargin>
                          {ownerAddress}
                        </Paragraph>
                        <Link
                          className={classes.open}
                          to={getEtherScanLink('address', ownerAddress)}
                          target="_blank"
                        >
                          <OpenInNew style={openIconStyle} />
                        </Link>
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Row>
                  <Paragraph>New owner</Paragraph>
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
                      testId={REPLACE_OWNER_NAME_INPUT_TEST_ID}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <AddressInput
                      name="ownerAddress"
                      component={TextField}
                      validators={[ownerDoesntExist]}
                      placeholder="Owner address*"
                      text="Owner address*"
                      className={classes.addressInput}
                      fieldMutator={mutators.setOwnerAddress}
                      testId={REPLACE_OWNER_ADDRESS_INPUT_TEST_ID}
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
                  testId={REPLACE_OWNER_NEXT_BTN_TEST_ID}
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
