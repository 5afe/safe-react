// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, inLimit, mustBeFloat, required, greaterThan, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const TKN_DESTINATION_PARAM = 'tknDestination'
export const TKN_VALUE_PARAM = 'tknValue'

type Props = {
  funds: string,
  symbol: string,
}

const SendTokenForm = ({ funds, symbol }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Send tokens Transaction
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Available tokens: ${funds} ${symbol}`}
    </Heading>
    <Block margin="md">
      <Field
        name={TKN_DESTINATION_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress)}
        placeholder="Destination*"
        text="Destination"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TKN_VALUE_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeFloat, greaterThan(0), inLimit(Number(funds), 0, 'available balance'))}
        placeholder="Amount of tokens*"
        text="Amount of Tokens"
      />
    </Block>
  </Block>
)

export default SendTokenForm
