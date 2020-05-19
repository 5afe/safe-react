//
import React from 'react'

import Col from 'components/layout/Col'
import Hairline from 'components/layout/Hairline'
import Row from 'components/layout/Row'
import ArrowDown from 'routes/safe/components/Balances/SendModal/screens/assets/arrow-down.svg'
import { sm } from 'theme/variables'

const FormDivisor = () => (
  <Row margin="md">
    <Col xs={1}>
      <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
    </Col>
    <Col center="xs" layout="column" xs={11}>
      <Hairline />
    </Col>
  </Row>
)

export default FormDivisor
