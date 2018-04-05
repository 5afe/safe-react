// @flow
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph/index'

type Props = {
  text: string
}

const NoSafe = ({ text }: Props) => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>{text}</Bold>
      </Paragraph>
    </Col>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Link to="/open">
        <Button variant="raised" size="small" color="primary">CREATE A NEW SAFE</Button>
      </Link>
    </Col>
  </Row>
)

export default NoSafe
