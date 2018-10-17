// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { TKN_DESTINATION_PARAM, TKN_VALUE_PARAM } from '~/routes/safe/component/SendToken/SendTokenForm/index'

type FormProps = {
  values: Object,
  submitting: boolean,
}

type Props = {
  symbol: string
}

const spinnerStyle = {
  minHeight: '50px',
}

const ReviewTx = ({ symbol }: Props) => (controls: React$Node, { values, submitting }: FormProps) => (
  <OpenPaper controls={controls}>
    <Heading tag="h2">Review the move token funds</Heading>
    <Paragraph align="left">
      <Bold>Destination: </Bold> {values[TKN_DESTINATION_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>{`Amount to transfer: ${values[TKN_VALUE_PARAM]} ${symbol}`}</Bold>
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </OpenPaper>
)

export default ReviewTx
