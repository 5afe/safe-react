// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { EDIT_DAILY_LIMIT_PARAM } from '~/routes/safe/component/EditDailyLimit/EditDailyLimitForm'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = () => (controls: React$Node, { values, submitting }: FormProps) => (
  <OpenPaper controls={controls}>
    <Heading tag="h2">Review the DailyLimit operation</Heading>
    <Paragraph align="left">
      <Bold>The new daily limit will be: </Bold> {values[EDIT_DAILY_LIMIT_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </OpenPaper>
)

export default Review
