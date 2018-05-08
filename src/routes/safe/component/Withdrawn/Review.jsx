// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import { DESTINATION_PARAM, VALUE_PARAM } from './withdrawn'

type FormProps = {
  values: Object,
}

const Review = () => ({ values }: FormProps) => (
  <Block>
    <Heading tag="h2">Review the Withdrawn Operation</Heading>
    <Paragraph layout="left">
      <Bold>Destination: </Bold> {values[DESTINATION_PARAM]}
    </Paragraph>
    <Paragraph layout="left">
      <Bold>Value in ETH: </Bold> {values[VALUE_PARAM]}
    </Paragraph>
  </Block>
)

export default Review
