// @flow
import * as React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'

type FormProps = {
  values: Object,
  submitting: boolean,
}

type Props = {
  address: string,
  tx: Object,
}

const Deployment = ({ address, tx }: Props) => (
  <Block>
    <Paragraph>Deployed safe to: {address}</Paragraph>
    <Block>
      <pre>{JSON.stringify(tx, null, 2) }</pre>
    </Block>
  </Block>
)

export default ({ address, tx }: Props) => ({ values, submitting }: FormProps) => (
  <Block>
    <Row>
      <Col xs={12} center="xs" md={6} margin="lg">
        {JSON.stringify(values, null, 2) }
      </Col>
      <Col xs={12} center="xs" md={6} margin="lg">
        { submitting
          ? <CircularProgress size={50} />
          : <Deployment address={address} tx={tx} />
        }
      </Col>
    </Row>
  </Block>
)
