// @flow
import React from 'react'
import classNames from 'classnames/bind'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Identicon from '~/components/Identicon'
import Link from '~/components/layout/Link'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import {
  composeValidators, required, mustBeEthereumAddress, minMaxLength,
} from '~/components/forms/validator'
import { styles } from './style'
import { secondary } from '~/theme/variables'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  ownerAddress: string,
  ownerName: string,
  network: string,
  onSubmit: Function,
}

const OwnerForm = ({
  classes, onClose, ownerAddress, ownerName, network, onSubmit,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <React.Fragment>
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
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <React.Fragment>
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
                      <Link className={classes.open} to={getEtherScanLink(ownerAddress, network)} target="_blank">
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
                  />
                </Col>
              </Row>
              <Row margin="md">
                <Col xs={8}>
                  <Field
                    name="ownerAddress"
                    component={TextField}
                    type="text"
                    validate={composeValidators(required, mustBeEthereumAddress)}
                    placeholder="Owner address*"
                    text="Owner address*"
                    className={classes.addressInput}
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
                data-testid="review-tx-btn"
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
