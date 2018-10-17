// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, minValue, maxValue, mustBeInteger, required } from '~/components/forms/validator'
import { type Safe } from '~/routes/safe/store/model/safe'

export const THRESHOLD_PARAM = 'threshold'

type ThresholdProps = {
  numOwners: number,
  safe: Safe,
}

const ThresholdForm = ({ numOwners, safe }: ThresholdProps) => (controls: React$Node) => (
  <OpenPaper controls={controls}>
    <Heading tag="h2" margin="lg">
      {'Change safe\'s threshold'}
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Safe's owners: ${numOwners} and Safe's threshold: ${safe.get('threshold')}`}
    </Heading>
    <Block margin="md">
      <Field
        name={THRESHOLD_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(
          required,
          mustBeInteger,
          minValue(1),
          maxValue(numOwners),
        )}
        placeholder="New threshold"
        text="Safe's threshold"
      />
    </Block>
  </OpenPaper>
)

export default ThresholdForm
