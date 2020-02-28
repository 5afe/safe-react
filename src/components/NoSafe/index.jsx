// @flow
import * as React from 'react'

import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph/index'
import Row from '~/components/layout/Row'
import { CreateSafe } from '~/routes/welcome/components/Layout'

type Props = {
  text: string,
  provider: string,
}

const NoSafe = ({ provider, text }: Props) => (
  <Row>
    <Col center="xs" margin="md" sm={10} smOffset={2} start="sm" xs={12}>
      <Paragraph size="lg">
        <Bold>{text}</Bold>
      </Paragraph>
    </Col>
    <Col center="xs" margin="md" sm={10} smOffset={2} start="sm" xs={12}>
      <CreateSafe provider={provider} />
    </Col>
  </Row>
)

export default NoSafe
