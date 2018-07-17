// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { TOKEN_PARAM } from '~/routes/tokens/component/AddToken/FirstPage'
import { LOGO_URL_PARAM, NAME_PARAM, SYMBOL_PARAM, DECIMALS_PARAM } from '~/routes/tokens/component/AddToken/SecondPage'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = () => ({ values, submitting }: FormProps) => (
  <Block>
    <Heading tag="h2">Review ERC20 Token operation</Heading>
    <Paragraph align="left">
      <Bold>Token address: </Bold> {values[TOKEN_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token name: </Bold> {values[NAME_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token symbol: </Bold> {values[SYMBOL_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token decimals: </Bold> {values[DECIMALS_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token logo: </Bold> {values[LOGO_URL_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </Block>
)


export default Review
