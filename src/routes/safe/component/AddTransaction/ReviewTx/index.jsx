// @flow
import * as React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { TX_NAME_PARAM, TX_DESTINATION_PARAM, TX_VALUE_PARAM } from '~/routes/safe/component/AddTransaction/createTransactions'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const ReviewTx = () => ({ values, submitting }: FormProps) => (
  <Block>
    <Heading tag="h2">Review the Multisig Tx</Heading>
    <Paragraph align="left">
      <Bold>Transaction Name: </Bold> {values[TX_NAME_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Destination: </Bold> {values[TX_DESTINATION_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Amount to transfer in ETH: </Bold> {values[TX_VALUE_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </Block>
)

export default ReviewTx
