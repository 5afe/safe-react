import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal, { ButtonStatus, Modal as GenericModal } from 'src/components/Modal'
import { getExplorerInfo } from 'src/config'
import { getDisableModuleTxData } from 'src/logic/safe/utils/modules'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'

import { ModulePair } from 'src/logic/safe/store/models/safe'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { useStyles } from './style'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { TransactionFees } from 'src/components/TransactionsFees'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

interface RemoveModuleModalProps {
  onClose: () => void
  selectedModulePair: ModulePair
}

export const RemoveModuleModal = ({ onClose, selectedModulePair }: RemoveModuleModalProps): React.ReactElement => {
  const classes = useStyles()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [txData, setTxData] = useState('')
  const dispatch = useDispatch()
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const [, moduleAddress] = selectedModulePair

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
    txRecipient: safeAddress,
    txAmount: '0',
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    const txData = getDisableModuleTxData(selectedModulePair, safeAddress)
    setTxData(txData)
  }, [selectedModulePair, safeAddress])

  const removeSelectedModule = async (txParameters: TxParameters): Promise<void> => {
    try {
      await dispatch(
        createTransaction({
          safeAddress,
          to: safeAddress,
          valueInWei: '0',
          txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
        }),
      )
    } catch (e) {
      console.error(`failed to remove the module ${selectedModulePair}`, e.message)
    }
  }

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
      description="Remove the selected Module"
      handleClose={onClose}
      paperClassName="modal"
      title="Remove Module"
      open
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
              <Row align="center" className={classes.modalHeading} grow>
                <Paragraph className={classes.modalManage} noMargin weight="bolder">
                  Remove module
                </Paragraph>
                <IconButton disableRipple onClick={onClose}>
                  <Close className={classes.modalClose} />
                </IconButton>
              </Row>
              <Hairline />
              <Block>
                <Row className={classes.modalOwner}>
                  <Col align="center" xs={1}>
                    <EthHashInfo
                      hash={moduleAddress}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(moduleAddress)}
                    />
                  </Col>
                </Row>
                <Row className={classes.modalDescription}>
                  <Paragraph noMargin size="lg">
                    After removing this module, any feature or app that uses this module might no longer work. If this
                    Safe requires more then one signature, the module removal will have to be confirmed by other owners
                    as well.
                  </Paragraph>
                </Row>
              </Block>
              <Block className={classes.accordionContainer}>
                {/* Tx Parameters */}
                <TxParametersDetail
                  txParameters={txParameters}
                  onEdit={toggleEditMode}
                  isTransactionCreation={isCreation}
                  isTransactionExecution={isExecution}
                  isOffChainSignature={isOffChainSignature}
                />
              </Block>
              <Row className={cn(classes.modalDescription, classes.gasCostsContainer)}>
                <TransactionFees
                  gasCostFormatted={gasCostFormatted}
                  isExecution={isExecution}
                  isCreation={isCreation}
                  isOffChainSignature={isOffChainSignature}
                  txEstimationExecutionStatus={txEstimationExecutionStatus}
                />
              </Row>
              <GenericModal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{
                    color: 'error',
                    onClick: () => removeSelectedModule(txParameters),
                    status: buttonStatus,
                    text: confirmButtonText,
                  }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
