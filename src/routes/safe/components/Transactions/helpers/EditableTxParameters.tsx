import React, { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import EditTxParametersForm from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'

type GasInfo = Pick<TxParameters, 'ethGasLimit' | 'ethGasPrice'>

type Props = {
  children: (txParameters: TxParameters, toggleStatus: () => void) => any
} & GasInfo

export const EditableTxParameters = ({ children, ethGasLimit, ethGasPrice }: Props): React.ReactElement => {
  const [isEditMode, toggleEditMode] = useState(false)
  const txParameters = useTransactionParameters()
  const { setEthGasPrice, setEthGasLimit } = txParameters

  /* Update TxParameters */
  useEffect(() => {
    setEthGasPrice(ethGasPrice)
    setEthGasLimit(ethGasLimit)
  }, [ethGasLimit, ethGasPrice, setEthGasPrice, setEthGasLimit])

  const toggleStatus = () => {
    toggleEditMode((prev) => !prev)
  }

  return isEditMode ? (
    <EditTxParametersForm txParameters={txParameters} onClose={toggleStatus} />
  ) : (
    children(txParameters, toggleStatus)
  )
}
