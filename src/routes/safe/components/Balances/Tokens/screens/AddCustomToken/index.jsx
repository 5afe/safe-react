// @flow
import React, { Component } from 'react'
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
import TokenPlaceholder from '~/routes/safe/components/Balances/assets/token_placeholder.svg'
import { styles } from './style'

class AddCustomToken extends Component {
  handleSubmit = (values) => {
    console.log(values)
  }

  render() {
    const { classes, setActiveScreen } = this.props
    const goBackToTokenList = () => {
      setActiveScreen('tokenList')
    }

    return (
      <React.Fragment>
        <GnoForm onSubmit={this.handleSubmit}>
          {(submitting: boolean, validating: boolean, ...rest: any) => (
            <React.Fragment>
              <Block className={classes.formContainer}>
                <Paragraph noMargin className={classes.title} weight="bolder" size="lg">
                  Add custom token
                </Paragraph>
                <Field
                  name="tokenAddress"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, mustBeEthereumAddress)}
                  placeholder="Token contract address*"
                  text="Token contract address*"
                  className={classes.addressInput}
                />
                <Row>
                  <Col xs={6} layout="column">
                    <Field
                      name="tokenSymbol"
                      component={TextField}
                      type="text"
                      validate={required}
                      placeholder="Token symbol*"
                      text="Token symbol"
                      className={classes.addressInput}
                    />
                    <Field
                      name="tokenDecimals"
                      component={TextField}
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
}

const AddCustomTokenComponent = withStyles(styles)(AddCustomToken)

export default AddCustomTokenComponent
