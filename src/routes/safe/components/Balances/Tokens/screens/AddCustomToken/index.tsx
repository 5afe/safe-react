import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { FormSpy } from 'react-final-form'

import { styles } from './style'
import { addressIsTokenContract, doesntExistInTokenList } from './validators'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import AddressInput from 'src/components/forms/AddressInput'
import { composeValidators, minMaxLength, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Checkbox } from '@gnosis.pm/safe-react-components'
import { useDispatch, useSelector } from 'react-redux'
import { addToken } from 'src/logic/tokens/store/actions/addToken'
import updateActiveTokens from 'src/logic/safe/store/actions/updateActiveTokens'
import activateTokenForAllSafes from 'src/logic/safe/store/actions/activateTokenForAllSafes'

import { List } from 'immutable'
import { Token, TokenProps } from 'src/logic/tokens/store/model/token'
import { orderedTokenListSelector } from 'src/logic/tokens/store/selectors'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { useToken } from 'src/logic/tokens/hooks/useToken'

export const ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID = 'add-custom-token-address-input'
export const ADD_CUSTOM_TOKEN_SYMBOLS_INPUT_TEST_ID = 'add-custom-token-symbols-input'
export const ADD_CUSTOM_TOKEN_DECIMALS_INPUT_TEST_ID = 'add-custom-token-decimals-input'
export const ADD_CUSTOM_TOKEN_FORM = 'add-custom-token-form'

const INITIAL_FORM_STATE = {
  address: '',
  name: '',
  symbol: '',
  decimals: null,
  logoUri: null,
  balance: 0,
}

const useStyles = makeStyles(styles)

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>

type TokenPropsForm = OptionalExceptFor<TokenProps, 'address'>

type Props = {
  onClose: () => void
  parentList: string
  safeAddress: string
  setActiveScreen: (string) => void
}

export const AddCustomToken = (props: Props): React.ReactElement => {
  const { onClose, parentList, safeAddress, setActiveScreen } = props
  const [formValues, setFormValues] = useState<TokenPropsForm>(INITIAL_FORM_STATE)
  const dispatch = useDispatch()
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const tokens: List<Token> = useSelector(orderedTokenListSelector)
  const classes = useStyles()
  const selectedToken = useToken(formValues.address, true)

  const handleSubmit = (values) => {
    const address = checksumAddress(values.address)
    const token = {
      address,
      decimals: values.decimals,
      symbol: values.symbol,
      name: values.symbol,
    }
    dispatch(addToken(token))

    if (values.showForAllSafes) {
      dispatch(activateTokenForAllSafes(token.address))
    } else {
      const activeTokensAddresses = activeTokens.map(({ address }) => address)
      dispatch(updateActiveTokens(safeAddress, activeTokensAddresses.push(token.address)))
    }

    onClose()
  }

  useEffect(() => {
    if (!selectedToken) return
    const { address, symbol, decimals, name } = selectedToken
    setFormValues({
      address,
      symbol,
      decimals,
      name,
    })
  }, [selectedToken])

  const populateFormValuesFromAddress = (tokenAddress: string) => {
    setFormValues({
      address: tokenAddress,
    })
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
      populateFormValuesFromAddress(values.address)
    }
  }

  const formMutators = {
    setTokenAddress: (args, state, utils) => {
      utils.changeValue(state, 'address', () => args[0])
    },
  }

  const goBack = () => {
    setActiveScreen(parentList)
  }

  return (
    <>
      <GnoForm
        initialValues={formValues}
        onSubmit={handleSubmit}
        formMutators={formMutators}
        testId={ADD_CUSTOM_TOKEN_FORM}
      >
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <Block className={classes.formContainer}>
                <Paragraph className={classes.title} noMargin size="lg" weight="bolder">
                  Add custom token
                </Paragraph>
                <AddressInput
                  fieldMutator={mutators.setTokenAddress}
                  className={classes.addressInput}
                  name="address"
                  placeholder="Token contract address*"
                  testId={ADD_CUSTOM_TOKEN_ADDRESS_INPUT_TEST_ID}
                  text="Token contract address*"
                  validators={[doesntExistInTokenList(tokens), addressIsTokenContract]}
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
                    <Block justify="center">
                      <Field
                        className={classes.checkbox}
                        component={Checkbox}
                        name="showForAllSafes"
                        type="checkbox"
                        label="Activate token for all Safes"
                      />
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
          )
        }}
      </GnoForm>
    </>
  )
}

export default AddCustomToken
