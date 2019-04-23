// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
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
  composeValidators, required, mustBeEthereumAddress, mustBeInteger,
} from '~/components/forms/validator'
import { type TokenProps } from '~/logic/tokens/store/model/token'
import TokenPlaceholder from '~/routes/safe/components/Balances/assets/token_placeholder.svg'
import { checkTokenExistence, INITIAL_FORM_STATE } from './validators'
import { styles } from './style'

type Props = {
  classes: Object,
  addToken: Function,
  updateActiveTokens: Function,
  safeAddress: string,
  activeTokens: List<TokenProps>,
  setActiveScreen: Function,
  onClose: Function,
}

const AddCustomToken = (props: Props) => {
  const {
    classes, setActiveScreen, onClose, addToken, updateActiveTokens, safeAddress, activeTokens,
  } = props
  const [formValue, setFormValue] = useState(INITIAL_FORM_STATE)

  const handleSubmit = (formValues) => {
    const activeTokensAddresses = activeTokens.map(({ address }) => address)
    const token = {
      address: formValues.address,
      decimals: formValues.decimals,
      symbol: formValues.symbol,
      name: formValues.symbol,
    }

    addToken(token)
    updateActiveTokens(safeAddress, activeTokensAddresses.push(token.address))
    onClose()
  }

  const goBackToTokenList = () => {
    setActiveScreen('tokenList')
  }

  return (
    <React.Fragment>
      <GnoForm onSubmit={handleSubmit} initialValues={formValue}>
        {() => (
          <React.Fragment>
            <Block className={classes.formContainer}>
              <Paragraph noMargin className={classes.title} weight="bolder" size="lg">
                Add custom token
              </Paragraph>
              <Field
                name="address"
                component={TextField}
                type="text"
                validate={composeValidators(required, mustBeEthereumAddress, checkTokenExistence(setFormValue))}
                placeholder="Token contract address*"
                text="Token contract address*"
                className={classes.addressInput}
              />
              <Row>
                <Col xs={6} layout="column">
                  <Field
                    name="symbol"
                    component={TextField}
                    type="text"
                    validate={required}
                    placeholder="Token symbol*"
                    text="Token symbol"
                    className={classes.addressInput}
                  />
                  <Field
                    name="decimals"
                    component={TextField}
                    disabled
                    type="text"
                    validate={composeValidators(required, mustBeInteger)}
                    placeholder="Token decimals*"
                    text="Token decimals*"
                    className={classes.addressInput}
                  />
                  <Block align="left">
                    <Field name="showForAllSafes" component={Checkbox} type="checkbox" className={classes.checkbox} />
                    <Paragraph weight="bolder" size="md" className={classes.checkboxLabel}>
                      Display token for all safes
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
              <Button className={classes.button} minWidth={140} onClick={goBackToTokenList}>
                Cancel
              </Button>
              <Button type="submit" className={classes.button} variant="contained" minWidth={140} color="primary">
                Save
              </Button>
            </Row>
          </React.Fragment>
        )}
      </GnoForm>
    </React.Fragment>
  )
}

const AddCustomTokenComponent = withStyles(styles)(AddCustomToken)

export default AddCustomTokenComponent
