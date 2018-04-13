// @flow
import * as React from 'react'
import { getNamesFrom, getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'

type FormProps = {
  values: Object,
}

const ReviewInformation = () => ({ values }: FormProps) => {
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)

  return (
    <Block>
      <Heading tag="h2">Review the Safe information</Heading>
      <Paragraph>
        <Bold>Safe Name: </Bold> {values.name}
      </Paragraph>
      <Paragraph>
        <Bold>Required confirmations: </Bold> {values.confirmations}
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
    </Block>
  )
}

export default ReviewInformation
