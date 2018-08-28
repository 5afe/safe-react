// @flow
import * as React from 'react'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'

type Props = {
  provider: string,
  network: string,
  connected: boolean,
}

const leftColumnStyle = {
  maxWidth: '80px',
}

const paragraphStyle = {
  margin: '2px',
}

const Details = ({ provider, network, connected }: Props) => {
  const status = connected ? 'Connected' : 'Not connected'

  return (
    <React.Fragment>
      <Col style={leftColumnStyle} layout="column">
        <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Status: </Paragraph>
        <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Client: </Paragraph>
        <Paragraph style={paragraphStyle} size="sm" noMargin align="right">Network: </Paragraph>
      </Col>
      <Col style={leftColumnStyle} layout="column">
        <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>{status}</Bold></Paragraph>
        <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>{provider}</Bold></Paragraph>
        <Paragraph style={paragraphStyle} size="sm" noMargin align="left"><Bold>{network}</Bold></Paragraph>
      </Col>
    </React.Fragment>
  )
}

export default Details
