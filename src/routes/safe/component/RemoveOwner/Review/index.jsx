// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { DECREASE_PARAM } from '~/routes/safe/component/RemoveOwner/RemoveOwnerForm'

type Props = {
  name: string,
}

type FormProps = {
  values: Object,
  submitting: boolean,
}

const spinnerStyle = {
  minHeight: '50px',
}

const Review = ({ name }: Props) => ({ values, submitting }: FormProps) => {
  const text = values[DECREASE_PARAM]
    ? 'This operation will decrease the threshold of the safe'
    : 'This operation will not modify the threshold of the safe'

  return (
    <Block>
      <Heading tag="h2">Review the Add Owner operation</Heading>
      <Paragraph align="left">
        <Bold>Owner Name: </Bold> {name}
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
