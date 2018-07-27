// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { TOKEN_ADRESS_PARAM } from '~/routes/tokens/component/AddToken/FirstPage'
import { TOKEN_LOGO_URL_PARAM, TOKEN_NAME_PARAM, TOKEN_SYMBOL_PARAM, TOKEN_DECIMALS_PARAM } from '~/routes/tokens/component/AddToken/SecondPage'

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
      <Bold>Token address: </Bold> {values[TOKEN_ADRESS_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token name: </Bold> {values[TOKEN_NAME_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token symbol: </Bold> {values[TOKEN_SYMBOL_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token decimals: </Bold> {values[TOKEN_DECIMALS_PARAM]}
    </Paragraph>
    <Paragraph align="left">
      <Bold>Token logo: </Bold> {values[TOKEN_LOGO_URL_PARAM]}
    </Paragraph>
    <Block style={spinnerStyle}>
      { submitting && <CircularProgress size={50} /> }
    </Block>
  </Block>
)


export default Review
