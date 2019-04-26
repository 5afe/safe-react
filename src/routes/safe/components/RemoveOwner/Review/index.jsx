// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { DECREASE_PARAM } from '~/routes/safe/components/RemoveOwner/RemoveOwnerForm'

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

const Review = ({ name }: Props) => (controls: React$Node, { values, submitting }: FormProps) => {
  const text = values[DECREASE_PARAM]
    ? 'This operation will decrease the threshold of the safe'
    : 'This operation will not modify the threshold of the safe'

  return (
    <OpenPaper controls={controls}>
      <Heading tag="h2">Review the Remove Owner operation</Heading>
      <Paragraph align="left">
        <Bold>Owner Name: </Bold> {name}
      </Paragraph>
      <Paragraph align="left">
        <Bold>{text}</Bold>
      </Paragraph>
      <Block style={spinnerStyle}>
        { submitting && <CircularProgress size={50} /> }
      </Block>
    </OpenPaper>
  )
}

export default Review
