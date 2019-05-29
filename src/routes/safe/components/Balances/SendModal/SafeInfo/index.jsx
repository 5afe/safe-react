// @flow
import React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import Link from '~/components/layout/Link'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import { copyToClipboard } from '~/utils/clipboard'
import { secondary, xs } from '~/theme/variables'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  balanceContainer: {
    fontSize: '12px',
    lineHeight: 1.08,
    letterSpacing: -0.5,
    backgroundColor: '#eae9ef',
    width: 'fit-content',
    padding: '6px',
    marginTop: xs,
    borderRadius: '3px',
  },
})

type Props = {
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
}

const SafeInfo = (props: Props) => {
  const {
    safeAddress, safeName, etherScanLink, ethBalance, classes,
  } = props

  return (
    <Row margin="md">
      <Col xs={1}>
        <Identicon address={safeAddress} diameter={32} />
      </Col>
      <Col xs={11} layout="column">
        <Paragraph weight="bolder" noMargin style={{ lineHeight: 1 }}>
          {safeName}
        </Paragraph>
        <Paragraph weight="bolder" onClick={copyToClipboard} noMargin>
          {safeAddress}
          <Link to={etherScanLink} target="_blank">
            <OpenInNew style={openIconStyle} />
          </Link>
        </Paragraph>
        <Block className={classes.balanceContainer}>
          <Paragraph noMargin>
            Balance:
            {' '}
            <Bold>
              {ethBalance}
              {' '}
              ETH
            </Bold>
          </Paragraph>
        </Block>
      </Col>
    </Row>
  )
}

export default withStyles(styles)(SafeInfo)
