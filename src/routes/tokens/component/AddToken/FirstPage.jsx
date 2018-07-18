// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeEthereumAddress, uniqueAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

type Props = {
  addresses: string[],
}

export const TOKEN_ADRESS_PARAM = 'tokenAddress'

const FirstPage = ({ addresses }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Add Custom ERC20 Token
    </Heading>
    <Block margin="md">
      <Field
        name={TOKEN_ADRESS_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress, uniqueAddress(addresses))}
        placeholder="ERC20 Token Address*"
        text="ERC20 Token Address"
      />
    </Block>
  </Block>
)

export default FirstPage
