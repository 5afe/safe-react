// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeInteger, mustBeUrl } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

export const TOKEN_NAME_PARAM = 'tokenName'
export const TOKEN_SYMBOL_PARAM = 'tokenSymbol'
export const TOKEN_DECIMALS_PARAM = 'tokenDecimals'
export const TOKEN_LOGO_URL_PARAM = 'tokenLogo'

const SecondPage = () => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Complete Custom Token information
    </Heading>
    <Block margin="md">
      <Field
        name={TOKEN_NAME_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="ERC20 Token Name*"
        text="ERC20 Token Name"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TOKEN_SYMBOL_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="ERC20 Token Symbol*"
        text="ERC20 Token Symbol"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TOKEN_DECIMALS_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeInteger)}
        placeholder="ERC20 Token Decimals*"
        text="ERC20 Token Decimals"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TOKEN_LOGO_URL_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeUrl)}
        placeholder="ERC20 Token Logo url*"
        text="ERC20 Token Logo"
      />
    </Block>
  </Block>
)

export default SecondPage
