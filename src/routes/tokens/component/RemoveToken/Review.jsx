// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'

type Props = {
  name: string,
  funds: string,
  symbol: string,
}

type FormProps = {
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = ({ name, funds, symbol }: Props) => ({ submitting }: FormProps) => (
  <Block>
    <Heading tag="h2">Remove CUSTOM ERC 20 Token</Heading>
    <Paragraph align="left">
      <Bold>You are about to remove the custom token: </Bold> {name}
    </Paragraph>
    <Paragraph align="left">
      <Bold>{`You have ${funds} ${symbol} in your wallet`}</Bold>
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </Block>
)

export default Review
