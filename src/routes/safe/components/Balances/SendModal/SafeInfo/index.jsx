// 
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { border, xs } from 'src/theme/variables'

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


const SafeInfo = (props) => {
  const { ethBalance, safeAddress, safeName } = props
  const classes = useStyles()

  return (
    <Row margin="md">
      <Col xs={1}>
        <Identicon address={safeAddress} diameter={32} />
      </Col>
      <Col layout="column" xs={11}>
        <Paragraph noMargin style={{ lineHeight: 1 }} weight="bolder">
          {safeName}
        </Paragraph>
        <Block justify="left">
          <Paragraph className={classes.address} noMargin weight="bolder">
            {safeAddress}
          </Paragraph>
          <CopyBtn content={safeAddress} />
          <EtherscanBtn type="address" value={safeAddress} />
        </Block>
        <Block className={classes.balanceContainer}>
          <Paragraph noMargin>
            Balance: <Bold>{`${ethBalance} ETH`}</Bold>
          </Paragraph>
        </Block>
      </Col>
    </Row>
  )
}

export default SafeInfo
