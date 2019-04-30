// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Link from '~/components/layout/Link'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Hairline from '~/components/layout/Hairline'
import {
  lg, md, sm, secondary, xs,
} from '~/theme/variables'
import { composeValidators, required, mustBeEthereumAddress } from '~/components/forms/validator'
import { copyToClipboard } from '~/utils/clipboard'
import ArrowDown from './assets/arrow-down.svg'

const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  formContainer: {
    padding: `${md} ${lg}`,
  },
  balanceContainer: {
    fontSize: '12px',
    lineHeight: 1.08,
    letterSpacing: -0.5,
    backgroundColor: '#eae9ef',
    width: 'fit-content',
    padding: '6px',
    marginTop: xs,
    borderRadius: '3px',
  },
})

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
}

const SendFunds = ({
  classes, onClose, safeAddress, etherScanLink, safeName, ethBalance,
}: Props) => {
  const handleSubmit = () => {}

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send Funds
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Col xs={1}>
            <Identicon address={safeAddress} diameter={32} />
          </Col>
          <Col xs={11} layout="column">
            <Paragraph weight="bolder" noMargin style={{ lineHeight: 1 }}>
              {safeName}
            </Paragraph>
            <Paragraph weight="bolder" onClick={copyToClipboard} noMargin>
              {safeAddress}
              <Link to={etherScanLink} target="_blank">
                <OpenInNew style={openIconStyle} />
              </Link>
            </Paragraph>
            <Block className={classes.balanceContainer}>
              <Paragraph noMargin>
                Balance:
                {' '}
                <Bold>
                  {ethBalance}
                  {' '}
                  ETH
                </Bold>
              </Paragraph>
            </Block>
          </Col>
        </Row>
        <Row margin="md">
          <Col xs={1}>
            <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
          </Col>
          <Col xs={11} center="xs" layout="column">
            <Hairline />
          </Col>
        </Row>
        <GnoForm onSubmit={handleSubmit}>
          {() => (
            <Row>
              <Col xs={12}>
                <Field
                  name="address"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, mustBeEthereumAddress)}
                  placeholder="Recipient*"
                  text="Recipient*"
                  className={classes.addressInput}
                />
              </Col>
            </Row>
          )}
        </GnoForm>
      </Block>
    </React.Fragment>
  )
}

export default withStyles(styles)(SendFunds)
