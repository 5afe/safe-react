// @flow
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph/index'

type Props = {
  onAddTx: () => void
}

const NoRights = ({ onAddTx }: Props) => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>No transactions found for this safe</Bold>
      </Paragraph>
    </Col>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Button
        onClick={onAddTx}
        variant="raised"
        color="primary"
      >
        Add Multisig Transaction
      </Button>
    </Col>
  </Row>
)

export default NoRights
