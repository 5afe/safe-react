import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
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
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { sameString } from 'src/utils/strings'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { RecordOf } from 'immutable'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'

import { styles } from './style'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ModalHeader } from '../ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'
import { getNativeCurrencyAddress } from 'src/config/utils'

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
  const tokens: any = useSelector(extendedSafeTokensSelector)
  const txToken = useMemo(() => tokens.find((token) => sameAddress(token.address, tx.token)), [tokens, tx.token])
  const isSendingNativeToken = useMemo(() => sameAddress(txToken?.address, getNativeCurrencyAddress()), [txToken])
  const txRecipient = isSendingNativeToken ? tx.recipientAddress : txToken?.address || ''
  const txValue = isSendingNativeToken ? toTokenUnit(tx.amount, nativeCurrency.decimals) : '0'
  const data = useTxData(isSendingNativeToken, tx.amount, tx.recipientAddress, txToken)
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const {
    gasCostFormatted,
    gasPriceFormatted,
    gasLimit,
    gasEstimation,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
  } = useEstimateTransactionGas({
    txData: data,
    txRecipient,
    txType: tx.txType,
    txAmount: txValue,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus, setButtonStatus] = useEstimationStatus(txEstimationExecutionStatus)
  const isSpendingLimit = sameString(tx.txType, 'spendingLimit')
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const doExecute = isExecution && executionApproved

  const submitTx = async (txParameters: TxParameters) => {
    setButtonStatus(ButtonStatus.LOADING)

    if (!safeAddress) {
      setButtonStatus(ButtonStatus.READY)
      logError(Errors._802)
      return
    }

    if (isSpendingLimit && txToken && tx.tokenSpendingLimit) {
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
        setButtonStatus(ButtonStatus.READY)
        logError(Errors._801, err.message)
      }
      return
    }

    dispatch(
      createTransaction({
        safeAddress: safeAddress,
        to: txRecipient as string,
        valueInWei: txValue,
        txData: data,
        txNonce: txParameters.safeNonce,
        safeTxGas: txParameters.safeTxGas,
        ethParameters: txParameters,
        notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        delayExecution: !executionApproved,
      }),
    )
    onClose()
  }

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldSafeTxGas = gasEstimation
    const newSafeTxGas = txParameters.safeTxGas

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (txParameters.ethGasLimit && gasLimit !== txParameters.ethGasLimit) {
      setManualGasLimit(txParameters.ethGasLimit)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          {/* Header */}
          <ModalHeader onClose={onClose} subTitle="2 of 2" title="Send funds" />

          <Hairline />

          <Block className={classes.container}>
            {/* SafeInfo */}
            <SafeInfo />
            <Divider withArrow />

            {/* Recipient */}
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Recipient
              </Paragraph>
            </Row>
            <Row align="center" margin="md" data-testid="recipient-review-step">
              <Col xs={12}>
                <PrefixedEthHashInfo
                  hash={tx.recipientAddress}
                  name={tx.recipientName}
                  showCopyBtn
                  showAvatar
                  explorerUrl={getExplorerInfo(tx.recipientAddress)}
                />
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

            {isExecution && !isSpendingLimit && <ExecuteCheckbox onChange={setExecutionApproved} />}

            {/* Tx Parameters */}
            {/* FIXME TxParameters should be updated to be used with spending limits */}
            {!isSpendingLimit && (
              <TxParametersDetail
                txParameters={txParameters}
                onEdit={toggleEditMode}
                isTransactionCreation={isCreation}
                isTransactionExecution={doExecute}
                isOffChainSignature={isOffChainSignature}
              />
            )}
          </Block>

          {/* Disclaimer */}
          {/* FIXME Estimation should be fixed to be used with spending limits */}
          {!isSpendingLimit && txEstimationExecutionStatus !== EstimationStatus.LOADING && (
            <ReviewInfoText
              gasCostFormatted={gasCostFormatted}
              isCreation={isCreation}
              isExecution={doExecute}
              isOffChainSignature={isOffChainSignature}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Footer */}
          <Modal.Footer withoutBorder={!isSpendingLimit && buttonStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onPrev, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => submitTx(txParameters),
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                testId: 'submit-tx-btn',
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}

export default ReviewSendFundsTx
