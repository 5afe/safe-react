// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { getHumanFriendlyToken } from '~/logic/tokens/store/actions/fetchTokens'
import { type Token } from '~/logic/tokens/store/model/token'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { sm } from '~/theme/variables'

type Props = {
  onClose: () => void,
  setActiveScreen: Function,
  classes: Object,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  tx: Object,
  tokens: List<Token>,
  createTransaction: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ReviewTx = ({
  classes,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  ethBalance,
  onClose,
  safeAddress,
  safeName,
  setActiveScreen,
  tokens,
  tx,
}: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const txToken = tokens.find(token => token.address === tx.token)
  const isSendingETH = txToken.address === ETH_ADDRESS
  const txRecipient = isSendingETH ? tx.recipientAddress : txToken.address

  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils
      let txData = EMPTY_DATA
      if (!isSendingETH) {
        const StandardToken = await getHumanFriendlyToken()
        const tokenInstance = await StandardToken.at(txToken.address)

        txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, 0).encodeABI()
      }

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, txRecipient, txData)
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
    const web3 = getWeb3()
    let txData = EMPTY_DATA
    let txAmount = web3.utils.toWei(tx.amount, 'ether')
    if (!isSendingETH) {
      const HumanFriendlyToken = await getHumanFriendlyToken()
      const tokenInstance = await HumanFriendlyToken.at(txToken.address)
      const decimals = await tokenInstance.decimals()
      txAmount = new BigNumber(tx.amount).times(10 ** decimals.toNumber()).toString()

      txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, txAmount).encodeABI()
      // txAmount should be 0 if we send tokens
      // the real value is encoded in txData and will be used by the contract
      // if txAmount > 0 it would send ETH from the Safe
      txAmount = 0
    }

    createTransaction({
      safeAddress,
      to: txRecipient,
      valueInWei: txAmount,
      txData,
      notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
      enqueueSnackbar,
      closeSnackbar,
    })
    onClose()
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <SafeInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
        <Row margin="md">
          <Col xs={1}>
            <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
          </Col>
          <Col center="xs" layout="column" xs={11}>
            <Hairline />
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Recipient
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Col xs={1}>
            <Identicon address={tx.recipientAddress} diameter={32} />
          </Col>
          <Col layout="column" xs={11}>
            <Block justify="left">
              <Paragraph className={classes.address} noMargin weight="bolder">
                {tx.recipientAddress}
              </Paragraph>
              <CopyBtn content={tx.recipientAddress} />
              <EtherscanBtn type="address" value={tx.recipientAddress} />
            </Block>
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Amount
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Img alt={txToken.name} height={28} onError={setImageToPlaceholder} src={txToken.logoUri} />
          <Paragraph className={classes.amount} noMargin size="md">
            {tx.amount} {txToken.symbol}
          </Paragraph>
        </Row>
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={() => setActiveScreen('sendFunds')}>
          Back
        </Button>
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
          minWidth={140}
          onClick={submitTx}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(withSnackbar(ReviewTx))
