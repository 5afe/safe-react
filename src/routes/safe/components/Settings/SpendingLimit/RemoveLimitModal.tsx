import cn from 'classnames'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { TransactionFees } from 'src/components/TransactionsFees'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getDeleteAllowanceTxData } from 'src/logic/safe/utils/spendingLimits'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { getResetTimeOptions } from './FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from './InfoDisplay'
import { SpendingLimitTable } from './LimitsTable/dataFetcher'
import { useStyles } from './style'

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

export const RemoveLimitModal = ({ onClose, spendingLimit, open }: RemoveSpendingLimitModalProps): ReactElement => {
  const classes = useStyles()

  const tokenInfo = useTokenInfo(spendingLimit.spent.tokenAddress)

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [txData, setTxData] = useState('')
  const dispatch = useDispatch()
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  useEffect(() => {
    const {
      beneficiary,
      spent: { tokenAddress },
    } = spendingLimit
    const txData = getDeleteAllowanceTxData({ beneficiary, tokenAddress })
    setTxData(txData)
  }, [spendingLimit])

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
    gasLimit,
    gasEstimation,
    gasPriceFormatted,
  } = useEstimateTransactionGas({
    txData,
    txRecipient: SPENDING_LIMIT_MODULE_ADDRESS,
    txAmount: '0',
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  const removeSelectedSpendingLimit = (txParameters: TxParameters) => {
    try {
      dispatch(
        createTransaction({
          safeAddress,
          to: SPENDING_LIMIT_MODULE_ADDRESS,
          valueInWei: '0',
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.REMOVE_SPENDING_LIMIT_TX,
        }),
      )
    } catch (e) {
      console.error(
        `failed to remove spending limit ${spendingLimit.beneficiary} -> ${spendingLimit.spent.tokenAddress}`,
        e.message,
      )
    }
  }

  const resetTimeLabel =
    getResetTimeOptions().find(({ value }) => +value === +spendingLimit.resetTime.resetTimeMin)?.label ?? ''

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = Number(gasPriceFormatted)
    const newGasPrice = Number(txParameters.ethGasPrice)
    const oldSafeTxGas = Number(gasEstimation)
    const newSafeTxGas = Number(txParameters.safeTxGas)

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

  let confirmButtonText = 'Remove'
  if (ButtonStatus.LOADING === buttonStatus) {
    confirmButtonText = txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : 'Removing'
  }

  return (
    <Modal
      handleClose={onClose}
      open={open}
      title="Remove spending limit"
      description="Remove the selected spending limit"
    >
      <EditableTxParameters
        isOffChainSignature={isOffChainSignature}
        isExecution={isExecution}
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeTxGas={gasEstimation.toString()}
        closeEditModalCallback={closeEditModalCallback}
      >
        {(txParameters, toggleEditMode) => {
          return (
            <>
              <Modal.Header onClose={onClose}>
                <Modal.Header.Title size="xs" withoutMargin>
                  Remove spending limit
                </Modal.Header.Title>
              </Modal.Header>

              <Modal.Body>
                <Col margin="lg">
                  <AddressInfo title="Beneficiary" address={spendingLimit.beneficiary} />
                </Col>
                <Col margin="lg">
                  {tokenInfo && (
                    <TokenInfo
                      amount={fromTokenUnit(spendingLimit.spent.amount, tokenInfo.decimals)}
                      title="Amount"
                      token={tokenInfo}
                    />
                  )}
                </Col>
                <Col margin="lg">
                  <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
                </Col>
                {/* Tx Parameters */}
                <TxParametersDetail
                  txParameters={txParameters}
                  onEdit={toggleEditMode}
                  isTransactionCreation={isCreation}
                  isTransactionExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                />
              </Modal.Body>

              <Row className={cn(classes.modalDescription, classes.gasCostsContainer)}>
                <TransactionFees
                  gasCostFormatted={gasCostFormatted}
                  isExecution={isExecution}
                  isCreation={isCreation}
                  isOffChainSignature={isOffChainSignature}
                  txEstimationExecutionStatus={txEstimationExecutionStatus}
                />
              </Row>

              <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{
                    color: 'error',
                    onClick: () => removeSelectedSpendingLimit(txParameters),
                    status: buttonStatus,
                    text: confirmButtonText,
                  }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
