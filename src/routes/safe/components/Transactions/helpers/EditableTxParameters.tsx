import { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditTxParametersForm } from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'
import { ParametersStatus } from './utils'

type Props = {
  children: (txParameters: TxParameters, toggleStatus: (txParameters?: TxParameters) => void) => any
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
  const defaultParameterStatus = isExecution ? 'ENABLED' : 'ETH_HIDDEN'
  const txParameters = useTransactionParameters({
    parametersStatus: parametersStatus || defaultParameterStatus,
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
      parametersStatus={parametersStatus ?? defaultParameterStatus}
    />
  ) : (
    children(txParameters, toggleStatus)
  )
}
