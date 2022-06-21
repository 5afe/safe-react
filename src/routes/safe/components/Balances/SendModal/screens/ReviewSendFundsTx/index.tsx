import { RecordOf } from 'immutable'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentChainId } from 'src/logic/config/store/selectors'
import { getSpendingLimitContract, getSpendingLimitModuleAddress } from 'src/logic/contracts/spendingLimitContracts'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getERC20TokenContract } from 'src/logic/tokens/store/actions/fetchTokens'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { TokenProps } from 'src/logic/tokens/store/model/token'

import { styles } from './style'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getNativeCurrencyAddress } from 'src/config/utils'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { isSpendingLimit } from 'src/routes/safe/components/Transactions/helpers/utils'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'
import { trackEvent } from 'src/utils/googleTagManager'
import { MODALS_EVENTS } from 'src/utils/events/modals'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { createSendParams } from 'src/logic/safe/transactions/gas'
import { SpendingLimitModalWrapper } from 'src/routes/safe/components/Transactions/helpers/SpendingLimitModalWrapper'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import { closeNotification, showNotification } from 'src/logic/notifications/store/notifications'

const useStyles = makeStyles(styles)

export type ReviewTxProp = {
  recipientAddress: string
  recipientName?: string
  amount: string
  txRecipient: string
  token: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type ReviewTxProps = {
  onClose: () => void
  onPrev: () => void
  tx: ReviewTxProp
}

const useTxData = (
  isSendingNativeToken: boolean,
  txAmount: string,
  recipientAddress: string,
  txToken?: RecordOf<TokenProps>,
): string => {
  const [data, setData] = useState('')

  useEffect(() => {
    const updateTxDataAsync = async () => {
      if (!txToken) {
        return
      }

      let txData = EMPTY_DATA
      if (!isSendingNativeToken) {
        const ERC20TokenInstance = getERC20TokenContract(txToken.address)
        const erc20TransferAmount = toTokenUnit(txAmount, txToken.decimals)
        txData = ERC20TokenInstance.methods.transfer(recipientAddress, erc20TransferAmount).encodeABI()
      }
      setData(txData)
    }

    updateTxDataAsync()
  }, [isSendingNativeToken, recipientAddress, txAmount, txToken])

  return data
}

const ReviewSendFundsTx = ({ onClose, onPrev, tx }: ReviewTxProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { safeAddress } = useSafeAddress()
  const nativeCurrency = getNativeCurrency()
  const tokens = useSelector(extendedSafeTokensSelector)
  const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])
  const isSendingNativeToken = useMemo(() => sameAddress(txToken?.address, getNativeCurrencyAddress()), [txToken])
  const txRecipient = isSendingNativeToken ? tx.recipientAddress : txToken?.address || ''
  const txValue = isSendingNativeToken ? toTokenUnit(tx.amount, nativeCurrency.decimals) : '0'
  const txData = useTxData(isSendingNativeToken, tx.amount, tx.recipientAddress, txToken)
  const isSpendingLimitTx = isSpendingLimit(tx.txType)
  const chainId = useSelector(currentChainId)

  const submitSpendingLimitTx = useCallback(
    async (txParameters: TxParameters) => {
      if (isSpendingLimitTx && txToken && tx.tokenSpendingLimit) {
        const spendingLimitTokenAddress = isSendingNativeToken ? ZERO_ADDRESS : txToken.address
        const spendingLimitModuleAddress = getSpendingLimitModuleAddress(chainId)
        if (!spendingLimitModuleAddress) return
        const spendingLimit = getSpendingLimitContract(spendingLimitModuleAddress)
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.SPENDING_LIMIT_TX)

        trackEvent(MODALS_EVENTS.USE_SPENDING_LIMIT)

        let beforeExecutionKey = ''
        try {
          beforeExecutionKey = dispatch(showNotification(notification.beforeExecution)) as unknown as string

          const allowanceTransferTx = await spendingLimit.methods.executeAllowanceTransfer(
            safeAddress,
            spendingLimitTokenAddress,
            tx.recipientAddress,
            toTokenUnit(tx.amount, txToken.decimals),
            ZERO_ADDRESS,
            0,
            tx.tokenSpendingLimit.delegate,
            EMPTY_DATA,
          )

          dispatch(closeNotification({ key: beforeExecutionKey, read: false }))

          const sendParams = createSendParams(tx.tokenSpendingLimit.delegate, txParameters)

          await allowanceTransferTx.send(sendParams).on('transactionHash', () => {
            onClose()
            dispatch(showNotification(notification.afterExecution.noMoreConfirmationsNeeded))
          })
        } catch (err) {
          logError(Errors._801, err.message)
          dispatch(closeNotification({ key: beforeExecutionKey, read: false }))
          dispatch(showNotification(notification.afterRejection))
        }
        onClose()
      }
    },
    [
      chainId,
      dispatch,
      isSendingNativeToken,
      isSpendingLimitTx,
      onClose,
      safeAddress,
      tx.amount,
      tx.recipientAddress,
      tx.tokenSpendingLimit,
      txToken,
    ],
  )

  const submitTx = useCallback(
    async (txParameters: TxParameters, delayExecution: boolean) => {
      dispatch(
        createTransaction({
          safeAddress: safeAddress,
          to: txRecipient as string,
          valueInWei: txValue,
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          delayExecution,
        }),
      )
      onClose()
    },
    [dispatch, onClose, safeAddress, txData, txRecipient, txValue],
  )

  const ModalWrapperBody = (
    <>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 2)} title="Send funds" />

      <Hairline />

      {isSpendingLimitTx ? (
        <Block className={classes.container}>
          Spending limit transactions only appear in the interface once they are successfully mined and indexed. Pending
          transactions can only be viewed in your signer wallet application or under your owner wallet address through a
          Blockchain Explorer.
        </Block>
      ) : null}

      <Block className={classes.container}>
        {/* Amount */}
        {txToken && (
          <Row align="center" margin="md">
            <TransferAmount token={txToken} text={`${tx.amount} ${txToken.symbol}`} />
          </Row>
        )}

        {/* SafeInfo */}
        <SafeInfo text="Sending from" />
        <Divider withArrow />

        {/* Recipient */}
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Recipient
          </Paragraph>
        </Row>
        <Row align="center" margin="md" data-testid="recipient-review-step">
          <Col xs={12}>
            <PrefixedEthHashInfo
              hash={tx.recipientAddress}
              name={tx.recipientName}
              strongName
              showCopyBtn
              showAvatar
              explorerUrl={getExplorerInfo(tx.recipientAddress)}
            />
          </Col>
        </Row>
      </Block>
    </>
  )

  if (isSpendingLimitTx) {
    return (
      <SpendingLimitModalWrapper
        txData=""
        txToken={txToken}
        txAmount={tx.amount}
        txDelegate={tx.tokenSpendingLimit?.delegate}
        txTo={tx.recipientAddress}
        onSubmit={submitSpendingLimitTx}
        onBack={onPrev}
        txType={tx.txType || ''}
      >
        {ModalWrapperBody}
      </SpendingLimitModalWrapper>
    )
  }

  return (
    <TxModalWrapper
      txData={txData}
      txValue={txValue}
      txTo={txRecipient}
      txType={tx.txType || ''}
      onSubmit={submitTx}
      onBack={onPrev}
    >
      {ModalWrapperBody}
    </TxModalWrapper>
  )
}

export default ReviewSendFundsTx
