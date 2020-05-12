// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'

import { styles } from './style'
import { getSymbolAndDecimalsFromContract } from './utils'
import { addressIsTokenContract, doesntExistInTokenList } from './validators'

import Checkbox from '~/components/forms/Checkbox'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, minMaxLength, mustBeEthereumAddress, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Token, type TokenProps } from '~/logic/tokens/store/model/token'
import TokenPlaceholder from '~/routes/safe/components/Balances/assets/token_placeholder.svg'
import { checksumAddress } from '~/utils/checksumAddress'

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
  parentList: 'assetsList' | 'tokenList',
}

const INITIAL_FORM_STATE = {
  address: '',
  decimals: '',
  symbol: '',
  logoUri: '',
}

const AddCustomToken = (props: Props) => {
  const {
    activateTokenForAllSafes,
    activeTokens,
    addToken,
    classes,
    onClose,
    parentList,
    safeAddress,
    setActiveScreen,
    tokens,
    updateActiveTokens,
  } = props
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)

  const handleSubmit = (values) => {
    const address = checksumAddress(values.address)
    const token = {
      address,
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
    const { dirty, errors, submitSucceeded, validating, values } = state
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

  const goBack = () => {
    setActiveScreen(parentList)
  }

  return (
    <>
      <GnoForm initialValues={formValues} onSubmit={handleSubmit} testId={ADD_CUSTOM_TOKEN_FORM}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Paragraph className={classes.title} noMargin size="lg" weight="bolder">
                Add custom token
              </Paragraph>
              <Field
                className={classes.addressInput}
                component={TextField}
                name="address"
                placeholder="Token contract address*"
                testId={ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID}
                text="Token contract address*"
                type="text"
                validate={composeValidators(
                  required,
                  mustBeEthereumAddress,
                  doesntExistInTokenList(tokens),
                  addressIsTokenContract,
                )}
              />
              <FormSpy
                onChange={formSpyOnChangeHandler}
                subscription={{
                  values: true,
                  errors: true,
                  validating: true,
                  dirty: true,
                  submitSucceeded: true,
                }}
              />
              <Row>
                <Col layout="column" xs={6}>
                  <Field
                    className={classes.addressInput}
                    component={TextField}
                    name="symbol"
                    placeholder="Token symbol*"
                    testId={ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID}
                    text="Token symbol"
                    type="text"
                    validate={composeValidators(required, minMaxLength(2, 12))}
                  />
                  <Field
                    className={classes.addressInput}
                    component={TextField}
                    disabled
                    name="decimals"
                    placeholder="Token decimals*"
                    testId={ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID}
                    text="Token decimals*"
                    type="text"
                  />
                  <Block justify="left">
                    <Field className={classes.checkbox} component={Checkbox} name="showForAllSafes" type="checkbox" />
                    <Paragraph className={classes.checkboxLabel} size="md" weight="bolder">
                      Activate token for all Safes
                    </Paragraph>
                  </Block>
                </Col>
                <Col align="center" layout="column" xs={6}>
                  <Paragraph className={classes.tokenImageHeading}>Token Image</Paragraph>
                  <Img alt="Token image" height={100} src={TokenPlaceholder} />
                </Col>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={goBack}>
                Cancel
              </Button>
              <Button color="primary" minHeight={42} minWidth={140} type="submit" variant="contained">
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
