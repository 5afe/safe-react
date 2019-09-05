// @flow
import React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import { copyToClipboard } from '~/utils/clipboard'
import Hairline from '~/components/layout/Hairline'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import ArrowDown from '../assets/arrow-down.svg'
import { secondary } from '~/theme/variables'
import { styles } from './style'

type Props = {
  onClose: () => void,
  setActiveScreen: Function,
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
  tx: Object,
  createTransaction: Function,
}

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const ReviewCustomTx = ({
  onClose,
  setActiveScreen,
  classes,
  safeAddress,
  etherScanLink,
  safeName,
  ethBalance,
  tx,
  createTransaction,
}: Props) => (
  <SharedSnackbarConsumer>
    {({ openSnackbar }) => {
      const submitTx = async () => {
        const web3 = getWeb3()
        const txRecipient = tx.recipientAddress
        const txData = tx.data
        const txValue = tx.value ? web3.utils.toWei(tx.value, 'ether') : 0

        createTransaction(safeAddress, txRecipient, txValue, txData, openSnackbar)
        onClose()
      }

      return (
        <>
          <Row align="center" grow className={classes.heading}>
            <Paragraph weight="bolder" className={classes.headingText} noMargin>
              Send Funds
            </Paragraph>
            <Paragraph className={classes.annotation}>2 of 2</Paragraph>
            <IconButton onClick={onClose} disableRipple>
              <Close className={classes.closeIcon} />
            </IconButton>
          </Row>
          <Hairline />
          <Block className={classes.container}>
            <SafeInfo
              safeAddress={safeAddress}
              etherScanLink={etherScanLink}
              safeName={safeName}
              ethBalance={ethBalance}
            />
            <Row margin="md">
              <Col xs={1}>
                <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
              </Col>
              <Col xs={11} center="xs" layout="column">
                <Hairline />
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
                Recipient
              </Paragraph>
            </Row>
            <Row margin="md" align="center">
              <Col xs={1}>
                <Identicon address={tx.recipientAddress} diameter={32} />
              </Col>
              <Col xs={11} layout="column">
                <Paragraph weight="bolder" onClick={copyToClipboard} noMargin>
                  {tx.recipientAddress}
                  <Link to={etherScanLink} target="_blank">
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Paragraph>
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
                Value
              </Paragraph>
            </Row>
            <Row margin="md" align="center">
              <Img src="tx.token.logoUri" height={28} alt="Ether" onError={setImageToPlaceholder} />
              <Paragraph size="md" noMargin className={classes.value}>
                {tx.value}
                {'ETH'}
              </Paragraph>
            </Row>
            <Row margin="md" align="center">
              <Col className={classes.outerData}>
                <Row size="md" noMargin className={classes.data}>
                  {tx.data}
                </Row>
              </Col>
            </Row>
          </Block>
          <Hairline />
          <Row align="center" className={classes.buttonRow}>
            <Button minWidth={140} minHeight={42} onClick={() => setActiveScreen('sendCustomTx')}>
              Back
            </Button>
            <Button
              type="submit"
              onClick={submitTx}
              variant="contained"
              minWidth={140}
              minHeight={42}
              color="primary"
              data-testid="submit-tx-btn"
            >
              SUBMIT
            </Button>
          </Row>
        </>
      )
    }}
  </SharedSnackbarConsumer>
)

export default withStyles(styles)(ReviewCustomTx)
