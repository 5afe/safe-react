// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, minValue, mustBeFloat, required } from '~/components/forms/validator'

export const EDIT_DAILY_LIMIT_PARAM = 'daily'

type EditDailyLimitProps = {
  dailyLimit: string,
}

const EditDailyLimitForm = ({ dailyLimit }: EditDailyLimitProps) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      {'Change safe\'s daily limit'}
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Actual daily limit: ${dailyLimit}`}
    </Heading>
    <Block margin="md">
      <Field
        name={EDIT_DAILY_LIMIT_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeFloat, minValue(0))}
        placeholder="New daily limit"
        text="Safe's daily limit"
      />
    </Block>
  </Block>
)

export default EditDailyLimitForm
