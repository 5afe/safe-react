import MenuItem from '@material-ui/core/MenuItem'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import SelectField from 'src/components/forms/SelectField'
import { composeValidators, differentFrom, minValue, mustBeInteger, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { useStyles } from './style'

const THRESHOLD_FIELD_NAME = 'threshold'

type ChangeThresholdModalProps = {
  onClose: () => void
  ownersCount?: number
  safeAddress: string
  threshold?: number
}

export const ChangeThresholdModal = ({
  onClose,
  ownersCount = 0,
  safeAddress,
  threshold = 1,
}: ChangeThresholdModalProps): ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeVersion = useSelector(currentSafeCurrentVersion) as string
  const [data, setData] = useState('')
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [editedThreshold, setEditedThreshold] = useState<number>(threshold)
  const [disabledSubmitForm, setDisabledSubmitForm] = useState<boolean>(true)

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isCreation,
    isExecution,
    isOffChainSignature,
    gasLimit,
    gasPriceFormatted,
    gasEstimation,
  } = useEstimateTransactionGas({
    txData: data,
    txRecipient: safeAddress,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    let isCurrent = true
    const calculateChangeThresholdData = () => {
      const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
      const txData = safeInstance.methods.changeThreshold(editedThreshold).encodeABI()
      if (isCurrent) {
        setData(txData)
      }
    }

    calculateChangeThresholdData()
    return () => {
      isCurrent = false
    }
  }, [safeAddress, safeVersion, editedThreshold])

  const handleThreshold = ({ target }) => {
    const value = parseInt(target.value)
    setDisabledSubmitForm(value === editedThreshold || value === threshold)
    setEditedThreshold(value)
  }

  const handleSubmit = ({ txParameters }) => {
    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        txData: data,
        txNonce: txParameters.safeNonce,
        safeTxGas: txParameters.safeTxGas,
        ethParameters: txParameters,
        notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
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
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <ModalHeader onClose={onClose} title="Change threshold" />
          <Hairline />
          <GnoForm initialValues={{ threshold: editedThreshold.toString(), txParameters }} onSubmit={handleSubmit}>
            {() => (
              <>
                <Block className={classes.modalContent}>
                  <Row>
                    <Paragraph weight="bolder">Any transaction requires the confirmation of:</Paragraph>
                  </Row>
                  <Row align="center" className={classes.inputRow} margin="xl">
                    <Col xs={2}>
                      <Field
                        data-testid="threshold-select-input"
                        name={THRESHOLD_FIELD_NAME}
                        onChange={handleThreshold}
                        render={(props) => (
                          <>
                            <SelectField {...props} disableError>
                              {[...Array(Number(ownersCount))].map((x, index) => (
                                <MenuItem key={index} value={`${index + 1}`}>
                                  {index + 1}
                                </MenuItem>
                              ))}
                            </SelectField>
                          </>
                        )}
                        validate={composeValidators(required, mustBeInteger, minValue(1), differentFrom(threshold))}
                      />
                    </Col>
                    <Col xs={10}>
                      <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                        {`out of ${ownersCount} owner(s)`}
                      </Paragraph>
                    </Col>
                  </Row>

                  {/* Tx Parameters */}
                  <TxParametersDetail
                    txParameters={txParameters}
                    onEdit={toggleEditMode}
                    isTransactionCreation={isCreation}
                    isTransactionExecution={isExecution}
                    isOffChainSignature={isOffChainSignature}
                  />
                </Block>
                {txEstimationExecutionStatus !== EstimationStatus.LOADING && (
                  <ReviewInfoText
                    gasCostFormatted={gasCostFormatted}
                    isCreation={isCreation}
                    isExecution={isExecution}
                    isOffChainSignature={isOffChainSignature}
                    safeNonce={txParameters.safeNonce}
                    txEstimationExecutionStatus={txEstimationExecutionStatus}
                  />
                )}

                <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
                  <Modal.Footer.Buttons
                    cancelButtonProps={{ onClick: onClose }}
                    confirmButtonProps={{
                      disabled: disabledSubmitForm,
                      status: buttonStatus,
                      text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                    }}
                  />
                </Modal.Footer>
              </>
            )}
          </GnoForm>
        </>
      )}
    </EditableTxParameters>
  )
}
