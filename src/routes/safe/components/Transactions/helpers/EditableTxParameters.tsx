import { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditTxParametersForm } from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'
import { ParametersStatus } from './utils'
import { useSelector } from 'react-redux'

import { currentSafeThreshold } from 'src/logic/safe/store/selectors'

type Props = {
  children: (txParameters: TxParameters, toggleStatus: (txParameters?: TxParameters) => void) => any
  isOffChainSignature: boolean
  isExecution: boolean
  parametersStatus?: ParametersStatus
  ethGasLimit?: TxParameters['ethGasLimit']
  ethGasPrice?: TxParameters['ethGasPrice']
  ethMaxPrioFee?: TxParameters['ethMaxPrioFee']
  safeNonce?: TxParameters['safeNonce']
  safeTxGas?: TxParameters['safeTxGas']
  closeEditModalCallback?: (txParameters: TxParameters) => void
}

export const EditableTxParameters = ({
  children,
  isOffChainSignature,
  isExecution,
  parametersStatus,
  ethGasLimit,
  ethGasPrice,
  ethMaxPrioFee,
  safeNonce,
  safeTxGas,
  closeEditModalCallback,
}: Props): React.ReactElement => {
  const [isEditMode, toggleEditMode] = useState(false)
  const [useManualValues, setUseManualValues] = useState(false)
  const threshold = useSelector(currentSafeThreshold) || 1
  const defaultParameterStatus = isOffChainSignature && threshold > 1 ? 'ETH_HIDDEN' : 'ENABLED'
  const txParameters = useTransactionParameters({
    parameterStatus: parametersStatus || defaultParameterStatus,
    initialEthGasLimit: ethGasLimit,
    initialEthGasPrice: ethGasPrice,
    initialEthMaxPrioFee: ethMaxPrioFee,
    initialSafeNonce: safeNonce,
    initialSafeTxGas: safeTxGas,
  })
  const { setEthGasPrice, setEthGasLimit, setEthMaxPrioFee, setSafeNonce, setSafeTxGas, setEthNonce } = txParameters

  // Update TxParameters
  useEffect(() => {
    if (!useManualValues) {
      setEthGasLimit(ethGasLimit)
      setEthGasPrice(ethGasPrice)
      setEthMaxPrioFee(ethMaxPrioFee)
      setSafeTxGas(safeTxGas)
    }
  }, [
    ethGasLimit,
    setEthGasLimit,
    ethGasPrice,
    setEthGasPrice,
    useManualValues,
    safeTxGas,
    setSafeTxGas,
    setEthMaxPrioFee,
    ethMaxPrioFee,
  ])

  const toggleStatus = () => {
    toggleEditMode((prev) => !prev)
  }

  const closeEditFormHandler = (txParameters?: TxParameters) => {
    if (txParameters) {
      setUseManualValues(true)
      setSafeNonce(txParameters.safeNonce)
      setSafeTxGas(txParameters.safeTxGas)
      setEthGasLimit(txParameters.ethGasLimit)
      setEthGasPrice(txParameters.ethGasPrice)
      setEthMaxPrioFee(txParameters.ethMaxPrioFee)
      setEthNonce(txParameters.ethNonce)
      closeEditModalCallback && closeEditModalCallback(txParameters)
    }
    toggleStatus()
  }

  return isEditMode ? (
    <EditTxParametersForm
      isExecution={isExecution}
      txParameters={txParameters}
      onClose={closeEditFormHandler}
      parametersStatus={parametersStatus ? parametersStatus : defaultParameterStatus}
    />
  ) : (
    children(txParameters, toggleStatus)
  )
}
