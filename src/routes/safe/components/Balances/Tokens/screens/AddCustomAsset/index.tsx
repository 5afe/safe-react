import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import { useSelector } from 'react-redux'

import { styles } from './style'
import { getSymbolAndDecimalsFromContract } from './utils'

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
import { nftAssetsListSelector } from 'src/logic/collectibles/store/selectors'

import {
  addressIsAssetContract,
  doesntExistInAssetsList,
} from 'src/routes/safe/components/Balances/Tokens/screens/AddCustomAsset/validators'
import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'
import { Checkbox } from '@gnosis.pm/safe-react-components'

export const ADD_CUSTOM_ASSET_ADDRESS_INPUT_TEST_ID = 'add-custom-asset-address-input'
export const ADD_CUSTOM_ASSET_SYMBOLS_INPUT_TEST_ID = 'add-custom-asset-symbols-input'
export const ADD_CUSTOM_ASSET_DECIMALS_INPUT_TEST_ID = 'add-custom-asset-decimals-input'
export const ADD_CUSTOM_ASSET_FORM = 'add-custom-asset-form'

const INITIAL_FORM_STATE = {
  address: '',
  decimals: '',
  symbol: '',
  logoUri: '',
}

const AddCustomAsset = (props) => {
  const { classes, onClose, parentList, setActiveScreen } = props

  const nftAssetsList = useSelector(nftAssetsListSelector)
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)

  const handleSubmit = () => {
    onClose()
  }

  const populateFormValuesFromAddress = async (tokenAddress) => {
    const tokenData = await getSymbolAndDecimalsFromContract(tokenAddress)

    if (tokenData.length) {
      const [symbol, decimals] = tokenData

      setFormValues({
        address: tokenAddress,
        symbol,
        decimals,
        name: symbol,
      } as any)
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

  const formMutators = {
    setAssetAddress: (args, state, utils) => {
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
        testId={ADD_CUSTOM_ASSET_FORM}
      >
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <Block className={classes.formContainer}>
                <Paragraph className={classes.title} noMargin size="lg" weight="bolder">
                  Add custom asset
                </Paragraph>
                <AddressInput
                  fieldMutator={mutators.setAssetAddress}
                  className={classes.addressInput}
                  name="address"
                  placeholder="Asset contract address*"
                  testId={ADD_CUSTOM_ASSET_ADDRESS_INPUT_TEST_ID}
                  text="Asset contract address*"
                  validators={[doesntExistInAssetsList(nftAssetsList), addressIsAssetContract]}
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
                      testId={ADD_CUSTOM_ASSET_SYMBOLS_INPUT_TEST_ID}
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
                      testId={ADD_CUSTOM_ASSET_DECIMALS_INPUT_TEST_ID}
                      text="Token decimals*"
                      type="text"
                    />
                    <Block justify="center">
                      <Field
                        className={classes.checkbox}
                        component={Checkbox}
                        name="showForAllSafes"
                        type="checkbox"
                        label="Activate assets for all Safes"
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

const AddCustomAssetComponent = withStyles(styles as any)(AddCustomAsset)

export default AddCustomAssetComponent
