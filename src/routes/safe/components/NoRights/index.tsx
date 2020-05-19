import * as React from 'react'

import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Link from 'src/components/layout/Link'
import Paragraph from 'src/components/layout/Paragraph/index'
import Row from 'src/components/layout/Row'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

const NoRights = () => (
  <Row>
    <Col center="xs" margin="md" sm={10} smOffset={2} start="sm" xs={12}>
      <Paragraph size="lg">
        <Bold>Impossible load Safe, check its address and ownership</Bold>
      </Paragraph>
    </Col>
    <Col center="xs" margin="md" sm={10} smOffset={2} start="sm" xs={12}>
      <Button color="primary" component={Link} to={SAFELIST_ADDRESS} variant="contained">
        Safe List
      </Button>
    </Col>
  </Row>
)

export default NoRights
