// @flow
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph/index'

const NoTransactions = () => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>No transactions found for this safe</Bold>
      </Paragraph>
    </Col>
  </Row>
)

export default NoTransactions
