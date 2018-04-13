// @flow
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph/index'
import { CreateSafe } from '~/routes/welcome/components/Layout'

type Props = {
  text: string,
  provider: string,
}

const NoSafe = ({ text, provider }: Props) => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>{text}</Bold>
      </Paragraph>
    </Col>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <CreateSafe provider={provider} />
    </Col>
  </Row>
)

export default NoSafe
