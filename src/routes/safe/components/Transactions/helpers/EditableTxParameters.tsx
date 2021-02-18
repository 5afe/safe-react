import React, { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditTxParametersForm } from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'
import { ParametersStatus } from './utils'
import { useSelector } from 'react-redux'
import { safeThresholdSelector } from 'src/logic/safe/store/selectors'

type Props = {
  children: (txParameters: TxParameters, toggleStatus: (txParameters?: TxParameters) => void) => any
  parametersStatus?: ParametersStatus
  ethGasLimit?: TxParameters['ethGasLimit']
  ethGasPrice?: TxParameters['ethGasPrice']
  safeNonce?: TxParameters['safeNonce']
  safeTxGas?: TxParameters['safeTxGas']
  closeEditModalCallback?: (txParameters: TxParameters) => void
}

export const EditableTxParameters = ({
  children,
  parametersStatus,
  ethGasLimit,
  ethGasPrice,
  safeNonce,
  safeTxGas,
  closeEditModalCallback,
}: Props): React.ReactElement => {
  const [isEditMode, toggleEditMode] = useState(false)
  const [useManualValues, setUseManualValues] = useState(false)
  const threshold = useSelector(safeThresholdSelector) || 1
  const defaultParameterStatus = threshold > 1 ? 'ETH_DISABLED' : 'ENABLED'
  const txParameters = useTransactionParameters({
    parameterStatus: parametersStatus || defaultParameterStatus,
    initialEthGasLimit: ethGasLimit,
    initialEthGasPrice: ethGasPrice,
    initialSafeNonce: safeNonce,
    initialSafeTxGas: safeTxGas,
  })
  const { setEthGasPrice, setEthGasLimit, setSafeNonce, setSafeTxGas, setEthNonce } = txParameters

  // Update TxParameters
  useEffect(() => {
    if (!useManualValues) {
      setEthGasLimit(ethGasLimit)
      setEthGasPrice(ethGasPrice)
      setSafeTxGas(safeTxGas)
    }
  }, [ethGasLimit, setEthGasLimit, ethGasPrice, setEthGasPrice, useManualValues, safeTxGas, setSafeTxGas])

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
      setEthNonce(txParameters.ethNonce)
      closeEditModalCallback && closeEditModalCallback(txParameters)
    }
    toggleStatus()
  }

  return isEditMode ? (
    <EditTxParametersForm
      txParameters={txParameters}
      onClose={closeEditFormHandler}
      parametersStatus={parametersStatus ? parametersStatus : defaultParameterStatus}
    />
  ) : (
    children(txParameters, toggleStatus)
  )
}
