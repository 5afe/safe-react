// @flow
import React from 'react'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'

const ExpandedTx = () => (
  <Block>
    <Row>
      <Col xs={6} layout="column">
        <Block>
          <Paragraph noMargin>
            <Bold>TX hash: </Bold>
            n/a
          </Paragraph>
          <Paragraph noMargin>
            <Bold>TX fee: </Bold>
            n/a
          </Paragraph>
          <Paragraph noMargin>
            <Bold>TX status: </Bold>
            n/a
          </Paragraph>
          <Paragraph noMargin>
            <Bold>TX created: </Bold>
            n/a
          </Paragraph>
          <Paragraph noMargin>
            <Bold>TX submitted: </Bold>
            n/a
          </Paragraph>
        </Block>
        <Hairline />
        <Block>
          <Paragraph noMargin>
            <Bold>Sent 1.00 ETH to:</Bold>
            <br />
            0xbc2BB26a6d821e69A38016f3858561a1D80d4182
          </Paragraph>
        </Block>
      </Col>
      <Col xs={6}>right</Col>
    </Row>
  </Block>
)

export default ExpandedTx
