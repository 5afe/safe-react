// @flow
import * as React from 'react'
import { getNamesFrom, getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import OpenPaper from '~/routes/open/components/OpenPaper'
import Col from '~/components/layout/Col'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import { FIELD_NAME, FIELD_CONFIRMATIONS, FIELD_DAILY_LIMIT } from '../fields'

const ReviewInformation = () => (controls: React$Node, { values }: Object) => {
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)

  return (
    <OpenPaper controls={controls}>
      <Heading tag="h2">Review the Safe information</Heading>
      <Paragraph>
        <Bold>Safe Name: </Bold> {values[FIELD_NAME]}
      </Paragraph>
      <Paragraph>
        <Bold>Required confirmations: </Bold> {values[FIELD_CONFIRMATIONS]}
      </Paragraph>
      <Paragraph>
        <Bold>Daily limit: </Bold> {values[FIELD_DAILY_LIMIT]} ETH
      </Paragraph>
      <Heading tag="h3">Owners</Heading>
      { names.map((name, index) => (
        <Row key={`name${(index)}`} margin="md">
          <Col xs={11} xsOffset={1}margin="sm">
            <Block>
              <Paragraph noMargin>{name}</Paragraph>
            </Block>
          </Col>
          <Col xs={11} xsOffset={1} margin="sm">
            <Block>
              <Paragraph noMargin>{addresses[index]}</Paragraph>
            </Block>
          </Col>
        </Row>
      ))}
    </OpenPaper>
  )
}

export default ReviewInformation
