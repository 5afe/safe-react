import StandardToken from '@gnosis.pm/util-contracts/build/contracts/GnosisStandardToken.json'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AbiItem } from 'web3-utils'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getSpendingLimitContract } from 'src/logic/contracts/safeContracts'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gasNew'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import ArrowDown from 'src/routes/safe/components/Balances/SendModal/screens/assets/arrow-down.svg'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { toTokenUnit } from 'src/routes/safe/components/Settings/SpendingLimit/utils'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { sm } from 'src/theme/variables'

import { styles } from './style'

const useStyles = makeStyles(styles)

const ReviewTx = ({ onClose, onPrev, tx }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { address: safeAddress } = useSelector(safeSelector) || {}
  const tokens = useSelector(extendedSafeTokensSelector)
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const [data, setData] = useState('')

  const txToken = useMemo(() => tokens.find((token) => token.address === tx.token), [tokens, tx.token])
  const isSendingETH = txToken?.address === ETH_ADDRESS
  const txRecipient = isSendingETH ? tx.recipientAddress : txToken?.address

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils

      if (!txToken) {
        return
      }

      let txData = EMPTY_DATA

      if (!isSendingETH) {
        const ERC20Instance = new web3.eth.Contract(StandardToken.abi as AbiItem[], txToken.address)
        txData = ERC20Instance.methods
          .transfer(tx.recipientAddress, toTokenUnit(tx.amount, txToken.decimals))
          .encodeABI()
      }

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress as string, txRecipient, txData)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)

      if (isCurrent) {
        setGasCosts(formattedGasCosts)
        setData(txData)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [isSendingETH, safeAddress, tx.amount, tx.recipientAddress, txRecipient, txToken])

  const submitTx = async () => {
    const isSpendingLimit = tx.txType === 'spendingLimit'
    const web3 = getWeb3()
    // txAmount should be 0 if we send tokens
    // the real value is encoded in txData and will be used by the contract
    // if txAmount > 0 it would send ETH from the Safe
    const txAmount = isSendingETH ? web3.utils.toWei(tx.amount, 'ether').toString() : '0'

    if (safeAddress) {
      if (isSpendingLimit && txToken) {
        const spendingLimit = getSpendingLimitContract()
        spendingLimit.methods
          .executeAllowanceTransfer(
            safeAddress,
            txToken.address === ETH_ADDRESS ? ZERO_ADDRESS : txToken.address,
            tx.recipientAddress,
            toTokenUnit(tx.amount, txToken.decimals),
            ZERO_ADDRESS,
            0,
            tx.tokenSpendingLimit.delegate,
            EMPTY_DATA,
          )
          .send({ from: tx.tokenSpendingLimit.delegate })
          .on('transactionHash', () => onClose())
          .catch(console.error)
      } else {
        dispatch(
          createTransaction({
            safeAddress,
            to: txRecipient,
            valueInWei: txAmount,
            txData: data,
            notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          }),
        )
        onClose()
      }
    }
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow data-testid="send-funds-review-step">
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
        <SafeInfo />
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
              <Paragraph
                className={classes.address}
                noMargin
                weight="bolder"
                data-testid="recipient-address-review-step"
              >
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
          <Img alt={txToken?.name as string} height={28} onError={setImageToPlaceholder} src={txToken?.logoUri} />
          <Paragraph
            className={classes.amount}
            noMargin
            size="md"
            data-testid={`amount-${txToken?.symbol as string}-review-step`}
          >
            {tx.amount} {txToken?.symbol}
          </Paragraph>
        </Row>
        <Row>
          <Paragraph data-testid="fee-meg-review-step">
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={onPrev}>
          Back
        </Button>
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
          disabled={!data}
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

export default ReviewTx
