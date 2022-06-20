import { ReactNode, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Link } from '@gnosis.pm/safe-react-components'
import { Box, Grid } from '@material-ui/core'

import {
  calculateTotalGasCost,
  EstimationStatus,
  useEstimateTransactionGas,
} from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { TxEstimatedFeesDetail } from 'src/routes/safe/components/Transactions/helpers/TxEstimatedFeesDetail'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { lg, md } from 'src/theme/variables'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { ParametersStatus } from 'src/routes/safe/components/Transactions/helpers/utils'
import useCanTxExecute from 'src/logic/hooks/useCanTxExecute'
import { useSelector } from 'react-redux'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { List } from 'immutable'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { getNativeCurrency } from 'src/config'
import { useEstimateSafeTxGas } from 'src/logic/hooks/useEstimateSafeTxGas'
import {
  checkIfOffChainSignatureIsPossible,
  generateSignaturesFromTxConfirmations,
  getPreValidatedSignatures,
} from 'src/logic/safe/safeTxSigner'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useIsSmartContractWallet from 'src/logic/hooks/useIsSmartContractWallet'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { DEFAULT_GAS_LIMIT, useEstimateGasLimit } from 'src/logic/hooks/useEstimateGasLimit'
import { useExecutionStatus } from 'src/logic/hooks/useExecutionStatus'
import { checkTransactionExecution, estimateGasForTransactionExecution } from 'src/logic/safe/transactions/gas'
import { useSimulation } from 'src/routes/safe/components/Transactions/helpers/Simulation/useSimulation'
import { getExecutionTransaction } from 'src/logic/safe/transactions'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { FETCH_STATUS } from 'src/utils/requests'
import { isSimulationAvailable } from '../Simulation/simulation'

type Props = {
  children: ReactNode
  operation?: Operation
  txNonce?: string
  txData: string
  txValue?: string
  txTo?: string
  txType?: string
  txConfirmations?: List<Confirmation>
  txThreshold?: number
  safeTxGas?: string
  onSubmit: (txParams: TxParameters, delayExecution?: boolean) => void
  onClose?: () => void
  onBack?: (...rest: any) => void
  submitText?: string
  isSubmitDisabled?: boolean
  isRejectTx?: boolean
}

const Container = styled.div`
  padding: 0 ${lg} ${md};
`
export const isApproveAndExecute = (
  threshold: number,
  txConfirmations: number,
  preApprovingOwner?: string,
): boolean => {
  if (txConfirmations === threshold) return false
  if (!preApprovingOwner) return false
  return txConfirmations + 1 === threshold
}

export const isMultisigCreation = (txConfirmations: number): boolean => txConfirmations === 0

/**
 * Determines which fields are displayed in the TxEditableParameters
 */
const getParametersStatus = (isCreation: boolean, doExecute: boolean, isRejectTx = false): ParametersStatus => {
  return isCreation && !isRejectTx
    ? doExecute
      ? 'ENABLED'
      : 'ETH_HIDDEN' // allow editing nonce when creating
    : doExecute
    ? 'SAFE_DISABLED'
    : 'DISABLED' // when not creating, nonce cannot be edited
}

export const TxModalWrapper = ({
  children,
  operation,
  txNonce,
  txData,
  txValue = '0',
  txTo,
  txType,
  txConfirmations,
  txThreshold,
  safeTxGas,
  onSubmit,
  onBack,
  onClose,
  submitText,
  isSubmitDisabled,
  isRejectTx = false,
}: Props): React.ReactElement => {
  const [manualSafeTxGas, setManualSafeTxGas] = useState<string>('0')
  const [manualGasPrice, setManualGasPrice] = useState<string>()
  const [manualMaxPrioFee, setManualMaxPrioFee] = useState<string>()
  const [manualGasLimit, setManualGasLimit] = useState<string>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const isOwner = useSelector(grantedSelector)
  const userAddress = useSelector(userAccountSelector)
  const { safeAddress } = useSafeAddress()
  const preApprovingOwner = isOwner ? userAddress : undefined
  const confirmationsLen = Array.from(txConfirmations || []).length
  const canTxExecute = useCanTxExecute(preApprovingOwner, confirmationsLen, txThreshold, txNonce)
  const doExecute = executionApproved && canTxExecute
  const showCheckbox = canTxExecute && (!txThreshold || txThreshold > confirmationsLen)
  const nativeCurrency = getNativeCurrency()
  const { currentVersion: safeVersion, threshold } = useSelector(currentSafe)
  const isCreation = isMultisigCreation(confirmationsLen)
  const isSmartContract = useIsSmartContractWallet(userAddress)
  const isOffChainSignature = checkIfOffChainSignatureIsPossible(doExecute, isSmartContract, safeVersion)
  const approvalAndExecution = isApproveAndExecute(Number(threshold), confirmationsLen, preApprovingOwner)
  const { simulateTransaction, simulation, simulationRequestStatus, simulationLink, simulationError } = useSimulation()

  const txParameters = useMemo(
    () => ({
      baseGas: '0',
      data: txData,
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      nonce: txNonce ? parseInt(txNonce) : 0,
      operation: operation || Operation.CALL,
      refundReceiver: ZERO_ADDRESS,
      safeInstance: getGnosisSafeInstanceAt(safeAddress, safeVersion),
      safeTxGas: safeTxGas || manualSafeTxGas || '0',
      sender: userAddress,
      sigs: generateSignaturesFromTxConfirmations(txConfirmations, approvalAndExecution ? userAddress : undefined),
      to: txTo || safeAddress,
      valueInWei: txValue,
      safeAddress,
    }),
    [
      approvalAndExecution,
      manualSafeTxGas,
      operation,
      safeAddress,
      safeTxGas,
      safeVersion,
      txConfirmations,
      txData,
      txNonce,
      txTo,
      txValue,
      userAddress,
    ],
  )

  const estimateGasLimit = useCallback(() => {
    return estimateGasForTransactionExecution(txParameters)
  }, [txParameters])

  const gasLimit = useEstimateGasLimit(estimateGasLimit, doExecute, txParameters.data, manualGasLimit)

  const checkTxExecution = useCallback((): Promise<boolean> => {
    return checkTransactionExecution({ ...txParameters, gasLimit })
  }, [gasLimit, txParameters])

  const txEstimationExecutionStatus = useExecutionStatus(checkTxExecution, doExecute, txParameters.data, gasLimit)

  const { result: safeTxGasEstimation, error: safeTxGasError } = useEstimateSafeTxGas({
    isRejectTx,
    txData,
    txRecipient: txTo || safeAddress,
    txAmount: txValue,
    operation,
  })
  if (safeTxGas == null) safeTxGas = safeTxGasEstimation

  const { gasPriceFormatted, gasPrice, gasMaxPrioFee, gasMaxPrioFeeFormatted } = useEstimateTransactionGas({
    manualGasPrice,
    manualMaxPrioFee,
    isExecution: doExecute,
    txData,
  })

  const getGasCostFormatted = useCallback(() => {
    if (!gasLimit || gasLimit === DEFAULT_GAS_LIMIT) return '> 0.001'
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
    const oldSafeTxGas = safeTxGas
    const newSafeTxGas = txParameters.safeTxGas

    if (oldGasPrice !== newGasPrice) {
      setManualGasPrice(newGasPrice)
    }

    if (oldMaxPrioFee !== newMaxPrioFee) {
      setManualMaxPrioFee(newMaxPrioFee)
    }

    if (oldGasLimit !== newGasLimit) {
      setManualGasLimit(newGasLimit)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  const onSubmitClick = (txParameters: TxParameters) => {
    setSubmitStatus(ButtonStatus.LOADING)

    if (!safeAddress) {
      setSubmitStatus(ButtonStatus.READY)
      logError(Errors._802)
      return
    }

    onSubmit(txParameters, !doExecute)
  }

  const parametersStatus = getParametersStatus(isCreation, doExecute, isRejectTx)

  const gasCost = `${getGasCostFormatted()} ${nativeCurrency.symbol}`

  const simulateTx = useCallback(() => {
    const sigs = getPreValidatedSignatures(userAddress)
    const data = getExecutionTransaction({ ...txParameters, sigs }).encodeABI()
    simulateTransaction(data, gasLimit)
  }, [simulateTransaction, txParameters, userAddress, gasLimit])

  return (
    <EditableTxParameters
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      ethMaxPrioFee={gasMaxPrioFeeFormatted}
      safeTxGas={safeTxGas}
      safeNonce={txNonce}
      parametersStatus={parametersStatus}
      closeEditModalCallback={onEditClose}
      txType={txType}
    >
      {(txParameters: TxParameters, toggleEditMode: () => void) => (
        <>
          {children}

          <Container>
            <Grid container alignItems="center" justifyContent="space-between" style={{ marginBottom: '16px' }}>
              {showCheckbox && <ExecuteCheckbox checked={executionApproved} onChange={setExecutionApproved} />}

              {isSimulationAvailable() && (
                <Button size="md" onClick={simulateTx} variant="contained" style={{ marginLeft: 'auto' }}>
                  Simulate
                </Button>
              )}
            </Grid>
            {simulationRequestStatus === FETCH_STATUS.SUCCESS && (
              <Box mb={2}>
                {!simulation?.simulation.status ? (
                  <Text color="inputFilled" size="lg">
                    The batch failed during the simulation throwing error <b>{simulation?.transaction.error_message}</b>{' '}
                    in the contract at <b>{simulation?.transaction.error_info?.address}</b>. Full simulation report is
                    available{' '}
                    <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                      <b>on Tenderly</b>
                    </Link>
                    .
                  </Text>
                ) : (
                  <Text color="inputFilled" size="lg">
                    The batch was successfully simulated. Full simulation report is available{' '}
                    <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                      <b>on Tenderly</b>
                    </Link>
                    .
                  </Text>
                )}
              </Box>
            )}
            {simulationRequestStatus === FETCH_STATUS.ERROR && Boolean(simulationError) && (
              <Box mb={2}>
                <Text color="error" size="lg">
                  An unexpected error occured during simulation: <b>{simulationError}</b>
                </Text>
              </Box>
            )}
            {doExecute && (
              <TxEstimatedFeesDetail
                txParameters={txParameters}
                gasCost={gasCost}
                onEdit={toggleEditMode}
                parametersStatus={parametersStatus}
              />
            )}

            <TxParametersDetail
              onEdit={toggleEditMode}
              txParameters={txParameters}
              isTransactionCreation={isCreation}
              isOffChainSignature={isOffChainSignature}
              parametersStatus={parametersStatus}
            />
          </Container>

          <ReviewInfoText
            isCreation={isCreation}
            isExecution={doExecute}
            isRejection={isRejectTx}
            safeNonce={txParameters.safeNonce}
            txEstimationExecutionStatus={safeTxGasError ? EstimationStatus.FAILURE : txEstimationExecutionStatus}
          />

          {/* Footer */}
          <Modal.Footer withoutBorder>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onBack || onClose, text: onBack ? 'Back' : 'Cancel' }}
              confirmButtonProps={{
                onClick: () => onSubmitClick(txParameters),
                status: submitStatus,
                disabled: isSubmitDisabled,
                color: isRejectTx ? 'error' : undefined,
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
