import * as React from 'react'

import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph/index'
import Row from 'src/components/layout/Row'
import { CreateSafe } from 'src/routes/welcome/components/Layout'

const NoSafe = ({ provider, text }) => (
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
