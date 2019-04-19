// @flow
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeEthereumAddress } from '~/components/forms/validator'
import { styles } from './style'

class AddCustomToken extends Component {
  handleSubmit = () => {
    console.log('form submitted')
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Paragraph noMargin className={classes.title} size="lg">
          Add custom token
        </Paragraph>
        <GnoForm onSubmit={this.handleSubmit}>
          {(submitting: boolean, validating: boolean, ...rest: any) => (
            <Block className={classes.inputContainer}>
              <Field
                name="tokenAddress"
                component={TextField}
                type="text"
                validate={composeValidators(required, mustBeEthereumAddress)}
                placeholder="Token contract address*"
                text="Token contract address*"
              />
            </Block>
          )}
        </GnoForm>
      </React.Fragment>
    )
  }
}

const AddCustomTokenComponent = withStyles(styles)(AddCustomToken)

export default AddCustomTokenComponent
