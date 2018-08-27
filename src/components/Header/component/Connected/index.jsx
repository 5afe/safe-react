// @flow
import * as React from 'react'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'

type Props = {
  provider: string,
}

const leftColumnStyle = {
  maxWidth: '80px',
}

const paragraphStyle = {
  margin: '2px',
}

const Connected = ({ provider }: Props) => (
  <React.Fragment>
    <Col style={leftColumnStyle} layout="column">
      <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Status: </Paragraph>
      <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Client: </Paragraph>
      <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Network: </Paragraph>
    </Col>
    <Col style={leftColumnStyle} layout="column">
      <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>Connected</Bold></Paragraph>
      <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>{provider}</Bold></Paragraph>
      <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>Rinkeby</Bold></Paragraph>
    </Col>
  </React.Fragment>
)

export default Connected
