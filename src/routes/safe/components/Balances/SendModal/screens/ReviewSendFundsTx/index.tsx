import { RecordOf } from 'immutable'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useMemo, useState } from 'react'
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
import { getSpendingLimitContract } from 'src/logic/contracts/spendingLimitContracts'
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
import { extractSafeAddress } from 'src/routes/routes'
import { getNativeCurrencyAddress } from 'src/config/utils'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { isSpendingLimit } from 'src/routes/safe/components/Transactions/helpers/utils'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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
  const safeAddress = extractSafeAddress()
  const nativeCurrency = getNativeCurrency()
  const tokens = useSelector(extendedSafeTokensSelector)
  const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])
  const isSendingNativeToken = useMemo(() => sameAddress(txToken?.address, getNativeCurrencyAddress()), [txToken])
  const txRecipient = isSendingNativeToken ? tx.recipientAddress : txToken?.address || ''
  const txValue = isSendingNativeToken ? toTokenUnit(tx.amount, nativeCurrency.decimals) : '0'
  const txData = useTxData(isSendingNativeToken, tx.amount, tx.recipientAddress, txToken)
  const isSpendingLimitTx = isSpendingLimit(tx.txType)

  const submitTx = async (txParameters: TxParameters, delayExecution: boolean) => {
    if (isSpendingLimitTx && txToken && tx.tokenSpendingLimit) {
      const spendingLimitTokenAddress = isSendingNativeToken ? ZERO_ADDRESS : txToken.address
      const spendingLimit = getSpendingLimitContract()
      try {
        await spendingLimit.methods
          .executeAllowanceTransfer(
            safeAddress,
            spendingLimitTokenAddress,
            tx.recipientAddress,
            toTokenUnit(tx.amount, txToken.decimals),
            ZERO_ADDRESS,
            0,
            tx.tokenSpendingLimit.delegate,
            EMPTY_DATA,
          )
          .send({ from: tx.tokenSpendingLimit.delegate })
          .on('transactionHash', () => onClose())
      } catch (err) {
        logError(Errors._801, err.message)
      }
      return
    }

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
      {/* Header */}
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 2)} title="Send funds" />

      <Hairline />

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
    </TxModalWrapper>
  )
}

export default ReviewSendFundsTx
