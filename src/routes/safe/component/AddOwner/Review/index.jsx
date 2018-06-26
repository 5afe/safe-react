// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { NAME_PARAM, OWNER_ADDRESS_PARAM, INCREASE_PARAM } from '~/routes/safe/component/AddOwner/AddOwnerForm'

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = () => ({ values, submitting }: FormProps) => {
  const text = values[INCREASE_PARAM]
    ? 'This operation will increase the threshold of the safe'
    : 'This operation will not modify the threshold of the safe'

  return (
    <Block>
      <Heading tag="h2">Review the Add Owner operation</Heading>
      <Paragraph align="left">
        <Bold>Owner Name: </Bold> {values[NAME_PARAM]}
      </Paragraph>
      <Paragraph align="left">
        <Bold>Owner Address: </Bold> {values[OWNER_ADDRESS_PARAM]}
      </Paragraph>
      <Paragraph align="left">
        <Bold>{text}</Bold>
      </Paragraph>
      <Block style={spinnerStyle}>
        { submitting && <CircularProgress size={50} /> }
      </Block>
    </Block>
  )
}

export default Review
