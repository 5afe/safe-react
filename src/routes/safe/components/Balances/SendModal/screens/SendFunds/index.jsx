// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import { OnChange } from 'react-final-form-listeners'
import Close from '@material-ui/icons/Close'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import AddressInput from '~/components/forms/AddressInput'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import ButtonLink from '~/components/layout/ButtonLink'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { type Token } from '~/logic/tokens/store/model/token'
import {
  composeValidators, required, mustBeFloat, maxValue, greaterThan,
} from '~/components/forms/validator'
import TokenSelectField from '~/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
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
  selectedToken: string,
  tokens: List<Token>,
  onSubmit: Function,
  initialValues: Object,
}

const SendFunds = ({
  classes,
  onClose,
  safeAddress,
  etherScanLink,
  safeName,
  ethBalance,
  tokens,
  selectedToken,
  initialValues,
  onSubmit,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  const formMutators = {
    setMax: (args, state, utils) => {
      const { token } = state.formState.values

      utils.changeValue(state, 'amount', () => token && token.balance)
    },
    onTokenChange: (args, state, utils) => {
      utils.changeValue(state, 'amount', () => '')
    },
    setRecipient: (args, state, utils) => {
      utils.changeValue(state, 'recipientAddress', () => args[0])
    },
  }

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit} formMutators={formMutators} initialValues={initialValues}>
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { token } = formState.values
          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo
                  safeAddress={safeAddress}
                  etherScanLink={etherScanLink}
                  safeName={safeName}
                  ethBalance={ethBalance}
                />
                <Row margin="md">
                  <Col xs={1}>
                    <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
                  </Col>
                  <Col xs={11} center="xs" layout="column">
                    <Hairline />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={12}>
                    <AddressInput
                      name="recipientAddress"
                      component={TextField}
                      placeholder="Recipient*"
                      text="Recipient*"
                      className={classes.addressInput}
                      fieldMutator={mutators.setRecipient}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TokenSelectField tokens={tokens} initialValue={selectedToken} />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
                      Amount
                    </Paragraph>
                    <ButtonLink weight="bold" onClick={mutators.setMax}>
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      name="amount"
                      component={TextField}
                      type="text"
                      validate={composeValidators(
                        required,
                        mustBeFloat,
                        greaterThan(0),
                        maxValue(token && token.balance),
                      )}
                      placeholder="Amount*"
                      text="Amount*"
                      className={classes.addressInput}
                      inputAdornment={
                        token && {
                          endAdornment: <InputAdornment position="end">{token.symbol}</InputAdornment>,
                        }
                      }
                    />
                    <OnChange name="token">
                      {() => {
                        mutators.onTokenChange()
                      }}
                    </OnChange>
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  minWidth={140}
                  color="primary"
                  data-testid="review-tx-btn"
                  className={classes.submitButton}
                >
                  Review
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(SendFunds)
