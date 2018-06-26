// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdraw/withdraw'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = () => ({ values, submitting }: FormProps) => (
  <Block>
    <Heading tag="h2">Review the Withdraw Operation</Heading>
    <Paragraph align="left">
      <Bold>Destination: </Bold> {values[DESTINATION_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Value in ETH: </Bold> {values[VALUE_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </Block>
)

export default Review
