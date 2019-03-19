// @flow
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph/index'
import { SAFELIST_ADDRESS } from '~/routes/routes'

const NoRights = () => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>Impossible load Safe, check its address and ownership</Bold>
      </Paragraph>
    </Col>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Button
        component={Link}
        to={SAFELIST_ADDRESS}
        variant="contained"
        color="primary"
      >
        Safe List
      </Button>
    </Col>
  </Row>
)

export default NoRights
