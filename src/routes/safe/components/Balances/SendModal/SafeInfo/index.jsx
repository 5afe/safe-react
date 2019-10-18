// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import { xs, border } from '~/theme/variables'

const useStyles = makeStyles({
  balanceContainer: {
    fontSize: '12px',
    lineHeight: 1.08,
    letterSpacing: -0.5,
    backgroundColor: border,
    width: 'fit-content',
    padding: '5px 10px',
    marginTop: xs,
    borderRadius: '3px',
  },
  address: {
    marginRight: xs,
  },
})

type Props = {
  safeAddress: string,
  safeName: string,
  ethBalance: string,
}

const SafeInfo = (props: Props) => {
  const {
    safeAddress, safeName, ethBalance,
  } = props
  const classes = useStyles()

  return (
    <Row margin="md">
      <Col xs={1}>
        <Identicon address={safeAddress} diameter={32} />
      </Col>
      <Col xs={11} layout="column">
        <Paragraph weight="bolder" noMargin style={{ lineHeight: 1 }}>
          {safeName}
        </Paragraph>
        <Block justify="left">
          <Paragraph weight="bolder" className={classes.address} noMargin>
            {safeAddress}
          </Paragraph>
          <CopyBtn content={safeAddress} />
          <EtherscanBtn type="address" value={safeAddress} />
        </Block>
        <Block className={classes.balanceContainer}>
          <Paragraph noMargin>
            Balance:
            {' '}
            <Bold>{`${ethBalance} ETH`}</Bold>
          </Paragraph>
        </Block>
      </Col>
    </Row>
  )
}

export default SafeInfo
