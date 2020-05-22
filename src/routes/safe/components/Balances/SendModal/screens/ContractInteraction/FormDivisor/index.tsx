import React from 'react'

import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import ArrowDown from 'src/routes/safe/components/Balances/SendModal/screens/assets/arrow-down.svg'
import { sm } from 'src/theme/variables'

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
