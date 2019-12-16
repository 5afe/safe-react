// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { FormSpy } from 'react-final-form'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Field from '~/components/forms/Field'
import Checkbox from '~/components/forms/Checkbox'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import Hairline from '~/components/layout/Hairline'
import {
  composeValidators, required, mustBeEthereumAddress, minMaxLength,
} from '~/components/forms/validator'
import { type TokenProps, type Token } from '~/logic/tokens/store/model/token'
import TokenPlaceholder from '~/routes/safe/components/Balances/assets/token_placeholder.svg'
import { addressIsTokenContract, doesntExistInTokenList } from './validators'
import { styles } from './style'
import { getSymbolAndDecimalsFromContract } from './utils'

export const ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID = 'add-custom-token-address-input'
export const ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID = 'add-custom-token-symbols-input'
export const ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID = 'add-custom-token-decimals-input'
export const ADD_CUSTOM_TOKEN_FORM = 'add-custom-token-form'

type Props = {
  classes: Object,
  addToken: Function,
  updateActiveTokens: Function,
  safeAddress: string,
  activeTokens: List<TokenProps>,
  tokens: List<Token>,
  setActiveScreen: Function,
  onClose: Function,
  activateTokenForAllSafes: Function,
}

const INITIAL_FORM_STATE = {
  address: '',
  decimals: '',
  symbol: '',
  logoUri: '',
}

const AddCustomToken = (props: Props) => {
  const {
    classes,
    setActiveScreen,
    onClose,
    addToken,
    updateActiveTokens,
    safeAddress,
    activeTokens,
    tokens,
    activateTokenForAllSafes,
  } = props
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)

  const handleSubmit = (values) => {
    const token = {
      address: values.address,
      decimals: values.decimals,
      symbol: values.symbol,
      name: values.symbol,
    }

    addToken(token)
    if (values.showForAllSafes) {
      activateTokenForAllSafes(token.address)
    } else {
      const activeTokensAddresses = activeTokens.map(({ address }) => address)
      updateActiveTokens(safeAddress, activeTokensAddresses.push(token.address))
    }

    onClose()
  }

  const populateFormValuesFromAddress = async (tokenAddress: string) => {
    const tokenData = await getSymbolAndDecimalsFromContract(tokenAddress)

    if (tokenData.length) {
      const [symbol, decimals] = tokenData

      setFormValues({
        address: tokenAddress,
        symbol,
        decimals,
        name: symbol,
      })
    }
  }

  const formSpyOnChangeHandler = async (state) => {
    const {
      errors, validating, values, dirty, submitSucceeded,
    } = state
    // for some reason this is called after submitting, we don't need to update the values
    // after submit
    if (submitSucceeded) {
      return
    }

    if (dirty && !validating && errors.address) {
      setFormValues(INITIAL_FORM_STATE)
    }

    if (!errors.address && !validating && dirty) {
      await populateFormValuesFromAddress(values.address)
    }
  }

  const goBackToTokenList = () => {
    setActiveScreen('tokenList')
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit} initialValues={formValues} testId={ADD_CUSTOM_TOKEN_FORM}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Paragraph noMargin className={classes.title} weight="bolder" size="lg">
                Add custom token
              </Paragraph>
              <Field
                name="address"
                component={TextField}
                type="text"
                validate={composeValidators(
                  required,
                  mustBeEthereumAddress,
                  doesntExistInTokenList(tokens),
                  addressIsTokenContract,
                )}
                placeholder="Token contract address*"
                text="Token contract address*"
                className={classes.addressInput}
                testId={ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID}
              />
              <FormSpy
                subscription={{
                  values: true,
                  errors: true,
                  validating: true,
                  dirty: true,
                  submitSucceeded: true,
                }}
                onChange={formSpyOnChangeHandler}
              />
              <Row>
                <Col xs={6} layout="column">
                  <Field
                    name="symbol"
                    component={TextField}
                    type="text"
                    validate={composeValidators(required, minMaxLength(2, 12))}
                    placeholder="Token symbol*"
                    text="Token symbol"
                    className={classes.addressInput}
                    testId={ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID}
                  />
                  <Field
                    name="decimals"
                    component={TextField}
                    disabled
                    type="text"
                    placeholder="Token decimals*"
                    text="Token decimals*"
                    className={classes.addressInput}
                    testId={ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID}
                  />
                  <Block justify="left">
                    <Field name="showForAllSafes" component={Checkbox} type="checkbox" className={classes.checkbox} />
                    <Paragraph weight="bolder" size="md" className={classes.checkboxLabel}>
                      Activate token for all Safes
                    </Paragraph>
                  </Block>
                </Col>
                <Col xs={6} layout="column" align="center">
                  <Paragraph className={classes.tokenImageHeading}>Token Image</Paragraph>
                  <Img src={TokenPlaceholder} alt="Token image" height={100} />
                </Col>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={goBackToTokenList}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" minWidth={140} minHeight={42} color="primary">
                Save
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

const AddCustomTokenComponent = withStyles(styles)(AddCustomToken)

export default AddCustomTokenComponent
