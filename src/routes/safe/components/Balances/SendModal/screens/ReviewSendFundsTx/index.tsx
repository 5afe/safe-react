import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toTokenUnit, fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { ExplorerButton, Text, Button, ButtonLink } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import CopyBtn from 'src/components/CopyBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getSpendingLimitContract } from 'src/logic/contracts/safeContracts'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { estimateTxGasCosts2, GasEstimationInfo } from 'src/logic/safe/transactions/gas'
import { getHumanFriendlyToken } from 'src/logic/tokens/store/actions/fetchTokens'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA, getUserNonce } from 'src/logic/wallets/ethTransactions'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sm } from 'src/theme/variables'
import { sameString } from 'src/utils/strings'
import { getLastTx, getNewTxNonce } from 'src/logic/safe/store/actions/utils'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

const useStyles = makeStyles(styles)

const { nativeCoin } = getNetworkInfo()

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export type ReviewTxProp = {
  recipientAddress: string
  amount: string
  txRecipient: string
  token: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type ReviewTxProps = {
  onClose: () => void
  onPrev: () => void
  onAdvancedOptions: () => void
  tx: ReviewTxProp
}

const ReviewSendFundsTx = ({ onClose, onPrev, tx, onAdvancedOptions }: ReviewTxProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { address: safeAddress } = useSelector(safeSelector) || {}
  const userAddress = useSelector(userAccountSelector)
  const tokens = useSelector(extendedSafeTokensSelector)
  const [gasInfo, setGasInfo] = useState<(GasEstimationInfo & { formattedTotalGas: string }) | undefined>()
  const [data, setData] = useState('')
  const [nonce, setNonce] = useState<number | undefined>()
  const [safeNonce, setSafeNonce] = useState<string | undefined>()
  const [safeTxGas] = useState(0)
  const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])
  const isSendingETH = sameAddress(txToken?.address, nativeCoin.address)
  const txRecipient = isSendingETH ? tx.recipientAddress : txToken?.address

  useEffect(() => {
    let isCurrent = true

    /* TODO: move to generic place */
    const estimateGas = async () => {
      if (!txToken) {
        return
      }

      let txData = EMPTY_DATA

      if (!isSendingETH) {
        const StandardToken = await getHumanFriendlyToken()
        const tokenInstance = await StandardToken.at(txToken.address as string)
        const txAmount = toTokenUnit(tx.amount, txToken.decimals)

        txData = tokenInstance.contract.methods.transfer(tx.recipientAddress, txAmount).encodeABI()
      }

      const estimation = await estimateTxGasCosts2(safeAddress as string, txRecipient as string, txData)
      const gasCosts = fromTokenUnit(estimation.total, nativeCoin.decimals)
      const formattedTotalGas = formatAmount(gasCosts)

      if (isCurrent) {
        setGasInfo({ ...estimation, formattedTotalGas })
        setData(txData)
      }
    }
    estimateGas()

    /* TODO: move to generic place */
    const getNonce = async () => {
      const res = await getUserNonce(userAddress)
      setNonce(res)
    }
    getNonce()

    /* TODO: move to generic place */
    const getSafeNonce = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress as string)
      const lastTx = await getLastTx(safeAddress as string)
      const nonce = await getNewTxNonce(undefined, lastTx, safeInstance)
      setSafeNonce(nonce)
    }
    getSafeNonce()

    /* TODO: Refactor */
    return () => {
      isCurrent = false
    }
  }, [isSendingETH, safeAddress, tx.amount, tx.recipientAddress, txRecipient, txToken, 'userAddress  '])

  const submitTx = async () => {
    const isSpendingLimit = sameString(tx.txType, 'spendingLimit')
    // txAmount should be 0 if we send tokens
    // the real value is encoded in txData and will be used by the contract
    // if txAmount > 0 it would send ETH from the Safe
    const txAmount = isSendingETH ? toTokenUnit(tx.amount, nativeCoin.decimals) : '0'

    if (!safeAddress) {
      console.error('There was an error trying to submit the transaction, the safeAddress was not found')
      return
    }

    if (isSpendingLimit && txToken && tx.tokenSpendingLimit) {
      const spendingLimit = getSpendingLimitContract()
      spendingLimit.methods
        .executeAllowanceTransfer(
          safeAddress,
          sameAddress(txToken.address, nativeCoin.address) ? ZERO_ADDRESS : txToken.address,
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
          safeAddress: safeAddress,
          to: txRecipient as string,
          valueInWei: txAmount,
          txData: data,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        }),
      )
      onClose()
    }
  }

  return (
    <>
      {/* Header */}
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
        {/* SafeInfo */}
        <SafeInfo />
        <Row margin="md">
          <Col xs={1}>
            <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
          </Col>
          <Col center="xs" layout="column" xs={11}>
            <Hairline />
          </Col>
        </Row>

        {/* Recipient */}
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
              <ExplorerButton explorerUrl={getExplorerInfo(tx.recipientAddress)} />
            </Block>
          </Col>
        </Row>

        {/* Amount */}
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

        {/* Tx Details */}

        <Text size="md" color="secondaryLight">
          Safe transactions parameters
        </Text>

        <TxParameterWrapper>
          <Text size="lg" color="text" strong>
            Safe
          </Text>
          <Text size="lg" color="text" strong>
            {safeNonce}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text" strong>
            SafeTxGas
          </Text>
          <Text size="lg" color="text" strong>
            {safeTxGas}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="secondaryLight">
            Ethereum transaction parameters
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text" strong>
            Ethereum nonce
          </Text>
          <Text size="lg" color="text" strong>
            {nonce}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text" strong>
            Ethereum gas limit
          </Text>
          <Text size="lg" color="text" strong>
            {gasInfo?.gasCost}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text" strong>
            Ethereum gas price
          </Text>
          <Text size="lg" color="text" strong>
            {parseInt(gasInfo?.gasPrice || '0', 10)}
          </Text>
        </TxParameterWrapper>
        <ButtonLink color="primary" onClick={onAdvancedOptions}>
          <Text size="xl" color="primary">
            Edit
          </Text>
        </ButtonLink>

        {/* Disclaimer */}
        <Row>
          <Paragraph data-testid="fee-meg-review-step">
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${
              gasInfo?.formattedTotalGas || '< 0.001'
            } (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>

      <Hairline style={{ position: 'absolute', bottom: 85 }} />

      {/* Footer */}
      <Row align="center" className={classes.buttonRow}>
        <Button size="md" color="primary" variant="outlined" onClick={onPrev}>
          Back
        </Button>
        <Button
          size="md"
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
          disabled={!data}
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

export default ReviewSendFundsTx
