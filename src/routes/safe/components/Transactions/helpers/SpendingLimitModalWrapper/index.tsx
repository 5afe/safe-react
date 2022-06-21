import { ReactNode, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  calculateTotalGasCost,
  EstimationStatus,
  useEstimateTransactionGas,
} from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { TxEstimatedFeesDetail } from 'src/routes/safe/components/Transactions/helpers/TxEstimatedFeesDetail'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { lg, md } from 'src/theme/variables'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { getNativeCurrency } from 'src/config'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { DEFAULT_GAS_LIMIT, useEstimateGasLimit } from 'src/logic/hooks/useEstimateGasLimit'
import { useExecutionStatus } from 'src/logic/hooks/useExecutionStatus'
import {
  AllowanceTransferProps,
  checkAllowanceTransferExecution,
  estimateGasForAllowanceTransfer,
} from 'src/logic/safe/transactions/allowance'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { Token } from 'src/logic/tokens/store/model/token'
import { getNativeCurrencyAddress } from 'src/config/utils'

type Props = {
  children: ReactNode
  operation?: Operation
  txNonce?: string
  txData: string
  txValue?: string
  txTo?: string
  txType?: string
  onSubmit: (txParams: TxParameters) => void
  onClose?: () => void
  onBack?: (...rest: any) => void
  submitText?: string
  isSubmitDisabled?: boolean
  txToken?: Token
  txDelegate?: string
  txAmount?: string
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`

export const SpendingLimitModalWrapper = ({
  children,
  txNonce,
  txTo,
  txType,
  onSubmit,
  onBack,
  onClose,
  submitText,
  isSubmitDisabled,
  txToken,
  txDelegate,
  txAmount,
}: Props): React.ReactElement => {
  const [manualGasPrice, setManualGasPrice] = useState<string>()
  const [manualMaxPrioFee, setManualMaxPrioFee] = useState<string>()
  const [manualGasLimit, setManualGasLimit] = useState<string>()
  const isSendingNativeToken = useMemo(() => sameAddress(txToken?.address, getNativeCurrencyAddress()), [txToken])
  const { safeAddress } = useSafeAddress()
  const nativeCurrency = getNativeCurrency()

  const allowanceTransferParams = useMemo((): AllowanceTransferProps => {
    return {
      safe: safeAddress,
      token: isSendingNativeToken ? ZERO_ADDRESS : txToken?.address || ZERO_ADDRESS,
      to: txTo || ZERO_ADDRESS,
      amount: toTokenUnit(txAmount || '0', txToken?.decimals || 0),
      paymentToken: ZERO_ADDRESS,
      payment: 0,
      delegate: txDelegate || ZERO_ADDRESS,
      signature: EMPTY_DATA,
    }
  }, [isSendingNativeToken, safeAddress, txAmount, txDelegate, txTo, txToken?.address, txToken?.decimals])

  const estimateGasLimit = useCallback(() => {
    return estimateGasForAllowanceTransfer(allowanceTransferParams)
  }, [allowanceTransferParams])

  const gasLimit = useEstimateGasLimit(estimateGasLimit, true, EMPTY_DATA, manualGasLimit)

  const checkAllowanceTransferTx = useCallback(() => {
    return checkAllowanceTransferExecution(allowanceTransferParams)
  }, [allowanceTransferParams])

  const { gasPriceFormatted, gasPrice, gasMaxPrioFee, gasMaxPrioFeeFormatted } = useEstimateTransactionGas({
    manualGasPrice,
    manualMaxPrioFee,
    isExecution: true,
    txData: EMPTY_DATA,
  })

  const txEstimationExecutionStatus = useExecutionStatus({
    checkTxExecution: checkAllowanceTransferTx,
    isExecution: true,
    txData: '',
    gasLimit,
    gasPrice,
    gasMaxPrioFee,
  })

  const getGasCostFormatted = useCallback(() => {
    if (!gasLimit || gasLimit === DEFAULT_GAS_LIMIT || !gasPrice || !gasMaxPrioFee) return '> 0.001'
    return calculateTotalGasCost(gasLimit, gasPrice, gasMaxPrioFee, nativeCurrency.decimals).gasCostFormatted
  }, [gasLimit, gasMaxPrioFee, gasPrice, nativeCurrency.decimals])

  const [submitStatus, setSubmitStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const onEditClose = (txParameters: TxParameters) => {
    const oldGasPrice = gasPriceFormatted
    const newGasPrice = txParameters.ethGasPrice
    const oldGasLimit = gasLimit
    const newGasLimit = txParameters.ethGasLimit
    const oldMaxPrioFee = gasMaxPrioFeeFormatted
    const newMaxPrioFee = txParameters.ethMaxPrioFee

    if (oldGasPrice !== newGasPrice) {
      setManualGasPrice(newGasPrice)
    }

    if (oldMaxPrioFee !== newMaxPrioFee) {
      setManualMaxPrioFee(newMaxPrioFee)
    }

    if (oldGasLimit !== newGasLimit) {
      setManualGasLimit(newGasLimit)
    }
  }

  const onSubmitClick = (txParameters: TxParameters) => {
    setSubmitStatus(ButtonStatus.LOADING)

    if (!safeAddress) {
      setSubmitStatus(ButtonStatus.READY)
      logError(Errors._802)
      return
    }

    onSubmit(txParameters)
  }

  const parametersStatus = 'ENABLED'

  const gasCost = `${getGasCostFormatted()} ${nativeCurrency.symbol}`

  return (
    <EditableTxParameters
      isExecution
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeNonce={txNonce}
      parametersStatus={parametersStatus}
      closeEditModalCallback={onEditClose}
      txType={txType}
    >
      {(txParameters: TxParameters, toggleEditMode: () => void) => (
        <>
          {children}

          <Container>
            <TxEstimatedFeesDetail
              txParameters={txParameters}
              gasCost={gasCost}
              onEdit={toggleEditMode}
              parametersStatus={parametersStatus}
            />
          </Container>

          <ReviewInfoText
            isCreation
            isExecution
            isRejection={false}
            safeNonce={txParameters.safeNonce}
            txEstimationExecutionStatus={txEstimationExecutionStatus}
          />

          <Modal.Footer withoutBorder>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack || onClose, text: onBack ? 'Back' : 'Cancel' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                disabled: isSubmitDisabled,
                color: undefined,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : submitText,
                testId: 'submit-tx-btn',
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
