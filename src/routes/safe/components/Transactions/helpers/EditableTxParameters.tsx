import React, { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import EditTxParametersForm from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'
import { ParametersStatus } from './utils'
import { useSelector } from 'react-redux'
import { safeThresholdSelector } from 'src/logic/safe/store/selectors'

type Props = {
  children: (txParameters: TxParameters, toggleStatus: () => void) => any
  calculateSafeNonce?: boolean
  parametersStatus?: ParametersStatus
  ethGasLimit?: TxParameters['ethGasLimit']
  ethGasPrice?: TxParameters['ethGasPrice']
  safeNonce?: TxParameters['safeNonce']
  safeTxGas?: TxParameters['safeTxGas']
}

export const EditableTxParameters = ({
  children,
  calculateSafeNonce = true,
  parametersStatus,
  ethGasLimit,
  ethGasPrice,
  safeNonce,
  safeTxGas,
}: Props): React.ReactElement => {
  const [isEditMode, toggleEditMode] = useState(false)
  const threshold = useSelector(safeThresholdSelector) || 1
  const defaultParameterStatus = threshold > 1 ? 'ETH_DISABLED' : 'ENABLED'
  const txParameters = useTransactionParameters({ calculateSafeNonce })
  const { setEthGasPrice, setEthGasLimit, setSafeNonce, setSafeTxGas } = txParameters

  /* Update TxParameters */
  useEffect(() => {
    setEthGasPrice(ethGasPrice)
    setEthGasLimit(ethGasLimit)
    safeNonce && setSafeNonce(safeNonce)
    safeTxGas && setSafeTxGas(safeTxGas)
  }, [ethGasLimit, ethGasPrice, safeNonce, safeTxGas, setEthGasPrice, setEthGasLimit, setSafeNonce, setSafeTxGas])

  const toggleStatus = () => {
    toggleEditMode((prev) => !prev)
  }

  return isEditMode ? (
    <EditTxParametersForm
      txParameters={txParameters}
      onClose={toggleStatus}
      parametersStatus={parametersStatus ? parametersStatus : defaultParameterStatus}
    />
  ) : (
    children(txParameters, toggleStatus)
  )
}
