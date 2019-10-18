// @flow
import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withSnackbar } from 'notistack'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import Web3Integration from '~/logic/wallets/web3Integration'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import ArrowDown from '../assets/arrow-down.svg'
import { styles } from './style'

type Props = {
  onClose: () => void,
  setActiveScreen: Function,
  classes: Object,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  tx: Object,
  createTransaction: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ReviewCustomTx = ({
  onClose,
  setActiveScreen,
  classes,
  safeAddress,
  safeName,
  ethBalance,
  tx,
  createTransaction,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')

  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const { web3 } = Web3Integration
      const { fromWei, toBN } = web3.utils

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, tx.recipientAddress, tx.data.trim())
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [])

  const submitTx = async () => {
    const { web3 } = Web3Integration
    const txRecipient = tx.recipientAddress
    const txData = tx.data.trim()
    const txValue = tx.value ? web3.utils.toWei(tx.value, 'ether') : 0

    createTransaction(
      safeAddress,
      txRecipient,
      txValue,
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
        <SafeInfo safeAddress={safeAddress} safeName={safeName} ethBalance={ethBalance} />
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
            <Block justify="left">
              <Paragraph weight="bolder" className={classes.address} noMargin>
                {tx.recipientAddress}
              </Paragraph>
              <CopyBtn content={tx.recipientAddress} />
              <EtherscanBtn type="address" value={tx.recipientAddress} />
            </Block>
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
            Value
          </Paragraph>
        </Row>
        <Row margin="md" align="center">
          <Img src={getEthAsToken('0').logoUri} height={28} alt="Ether" onError={setImageToPlaceholder} />
          <Paragraph size="md" noMargin className={classes.value}>
            {tx.value || 0}
            {' ETH'}
          </Paragraph>
        </Row>
        <Row margin="xs">
          <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
            Data (hex encoded)
          </Paragraph>
        </Row>
        <Row margin="md" align="center">
          <Col className={classes.outerData}>
            <Row size="md" className={classes.data}>
              {tx.data}
            </Row>
          </Col>
        </Row>
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={() => setActiveScreen('sendCustomTx')}>
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

export default withStyles(styles)(withSnackbar(ReviewCustomTx))
