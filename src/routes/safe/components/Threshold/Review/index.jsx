// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { THRESHOLD_PARAM } from '~/routes/safe/components/Threshold/ThresholdForm'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = () => (controls: React.Node, { values, submitting }: FormProps) => (
  <OpenPaper controls={controls}>
    <Heading tag="h2">Review the Threshold operation</Heading>
    <Paragraph align="left">
      <Bold>The new threshold will be: </Bold>
      {' '}
      {values[THRESHOLD_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </OpenPaper>
)

export default Review
