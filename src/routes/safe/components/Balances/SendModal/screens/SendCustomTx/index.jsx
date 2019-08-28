// @flow
import React from 'react'
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
import TextareaField from '~/components/forms/TextareaField'
import {
  composeValidators,
  required,
  mustBeEthereumAddress,
} from '~/components/forms/validator'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import ArrowDown from '../assets/arrow-down.svg'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
  onSubmit: Function,
  initialValues: Object,
}

const SendCustomTx = ({
  classes,
  onClose,
  safeAddress,
  etherScanLink,
  safeName,
  ethBalance,
  onSubmit,
  initialValues,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  const formMutators = {}

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send custom transactions
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <SafeInfo safeAddress={safeAddress} etherScanLink={etherScanLink} safeName={safeName} ethBalance={ethBalance} />
        <Row margin="md">
          <Col xs={1}>
            <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
          </Col>
          <Col xs={11} center="xs" layout="column">
            <Hairline />
          </Col>
        </Row>
        <GnoForm onSubmit={handleSubmit} formMutators={formMutators} initialValues={initialValues}>
          {() => (
            <React.Fragment>
              <Row margin="md">
                <Col xs={12}>
                  <Field
                    name="recipientAddress"
                    component={TextField}
                    type="text"
                    validate={composeValidators(required, mustBeEthereumAddress)}
                    placeholder="Recipient*"
                    text="Recipient*"
                    className={classes.addressInput}
                  />
                </Col>
              </Row>
              <Row margin="sm">
                <Col>
                  <TextareaField
                    name="data"
                    type="text"
                    placeholder="Data interface (ABI / JSON)*"
                    text="Data interface (ABI / JSON)*"
                  />
                </Col>
              </Row>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} minHeight={42} onClick={onClose}>
                    Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  minHeight={42}
                  minWidth={140}
                  color="primary"
                  data-testid="review-tx-btn"
                >
                    Review
                </Button>
              </Row>
            </React.Fragment>
          )}
        </GnoForm>
      </Block>
    </React.Fragment>
  )
}

export default withStyles(styles)(SendCustomTx)
