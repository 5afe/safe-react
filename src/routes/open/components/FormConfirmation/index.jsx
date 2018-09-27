// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Paragraph from '~/components/layout/Paragraph'
import Pre from '~/components/layout/Pre'
import Row from '~/components/layout/Row'

type FormProps = {
  submitting: boolean,
}

type Props = {
  address: string,
  tx: Object,
}

export const DEPLOYED_COMPONENT_ID = 'deployedSafeComponent'

const Deployment = ({ address, tx }: Props) => (
  <Block className={DEPLOYED_COMPONENT_ID}>
    <Paragraph><Bold>Deployed safe to: </Bold>{address}</Paragraph>
    <Pre>
      {JSON.stringify(tx, null, 2) }
    </Pre>
  </Block>
)

export default ({ address, tx }: Props) => (controls: React$Node, { submitting }: FormProps) => {
  const txFinished = !!address

  return (
    <OpenPaper controls={controls}>
      { !txFinished &&
        <React.Fragment>
          <Paragraph align="center" size="lg">
            You are about to create a Safe for keeping your funds more secure.
          </Paragraph>
          <Paragraph align="center" size="lg">
            Remember to check you have enough funds in your wallet.
          </Paragraph>
        </React.Fragment>
      }
      <Row>
        <Col xs={12} center={submitting ? 'xs' : undefined} margin="lg">
          { submitting
            ? <CircularProgress size={50} />
            : txFinished && <Deployment address={address} tx={tx} />
          }
        </Col>
      </Row>
    </OpenPaper>
  )
}
