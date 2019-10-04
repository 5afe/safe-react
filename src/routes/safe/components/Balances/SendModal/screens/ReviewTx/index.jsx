// @flow
import React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withSnackbar } from 'notistack'
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
import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { secondary } from '~/theme/variables'
import { isEther } from '~/logic/tokens/utils/tokenHelpers'
import ArrowDown from '../assets/arrow-down.svg'
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
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const ReviewTx = ({
  onClose,
  setActiveScreen,
  classes,
  safeAddress,
  etherScanLink,
  safeName,
  ethBalance,
  tx,
  createTransaction,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const submitTx = async () => {
    const web3 = getWeb3()
    const isSendingETH = isEther(tx.token.symbol)
    const txRecipient = isSendingETH ? tx.recipientAddress : tx.token.address
    let txData = EMPTY_DATA
    let txAmount = web3.utils.toWei(tx.amount, 'ether')

    if (!isSendingETH) {
      const StandardToken = await getStandardTokenContract()
      const tokenInstance = await StandardToken.at(tx.token.address)

      txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, txAmount).encodeABI()
      // txAmount should be 0 if we send tokens
      // the real value is encoded in txData and will be used by the contract
      // if txAmount > 0 it would send ETH from the Safe
      txAmount = 0
    }

    createTransaction(
      safeAddress,
      txRecipient,
      txAmount,
      txData,
      TX_NOTIFICATION_TYPES.STANDARD_TX,
      enqueueSnackbar,
      closeSnackbar,
    )
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
            Amount
          </Paragraph>
        </Row>
        <Row margin="md" align="center">
          <Img src={tx.token.logoUri} height={28} alt={tx.token.name} onError={setImageToPlaceholder} />
          <Paragraph size="md" noMargin className={classes.amount}>
            {tx.amount}
            {' '}
            {tx.token.symbol}
          </Paragraph>
        </Row>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={() => setActiveScreen('sendFunds')}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={submitTx}
          variant="contained"
          minWidth={140}
          color="primary"
          data-testid="submit-tx-btn"
          className={classes.submitButton}
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(withSnackbar(ReviewTx))
