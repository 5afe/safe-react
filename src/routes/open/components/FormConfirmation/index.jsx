// @flow
import * as React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import Pre from '~/components/layout/Pre'
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
    <Pre>
      {JSON.stringify(tx, null, 2) }
    </Pre>
  </Block>
)

export default ({ address, tx }: Props) => ({ values, submitting }: FormProps) => (
  <Block>
    <Row>
      <Col xs={6} margin="lg">
        <Pre>
          {JSON.stringify(values, null, 2) }
        </Pre>
      </Col>
      <Col xs={6} margin="lg">
        { submitting
          ? <CircularProgress size={50} />
          : <Deployment address={address} tx={tx} />
        }
      </Col>
    </Row>
  </Block>
)
