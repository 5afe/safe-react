import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { List } from 'immutable'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import SelectField from 'src/components/forms/SelectField'
import { composeValidators, differentFrom, minValue, mustBeInteger, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { SafeOwner } from 'src/logic/safe/store/models/safe'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { styles } from './style'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const THRESHOLD_FIELD_NAME = 'threshold'

const useStyles = makeStyles(styles)

type ChangeThresholdModalProps = {
  onClose: () => void
  owners?: List<SafeOwner>
  safeAddress: string
  threshold?: number
}

export const ChangeThresholdModal = ({
  onClose,
  owners,
  safeAddress,
  threshold = 1,
}: ChangeThresholdModalProps): ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [data, setData] = useState('')
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [editedThreshold, setEditedThreshold] = useState<number>(threshold)

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
  })

  useEffect(() => {
    let isCurrent = true
    const calculateChangeThresholdData = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      const txData = safeInstance.methods.changeThreshold(editedThreshold).encodeABI()
      if (isCurrent) {
        setData(txData)
      }
    }

    calculateChangeThresholdData()
    return () => {
      isCurrent = false
    }
  }, [safeAddress, editedThreshold])

  const getParametersStatus = () => (threshold > 1 ? 'ETH_DISABLED' : 'ENABLED')

  const handleSubmit = async ({ txParameters }) => {
    await dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        txData: data,
        txNonce: txParameters.safeNonce,
        safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
        ethParameters: txParameters,
        notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      }),
    )

    onClose()
  }

  const closeEditModalCallback = (txParameters: TxParameters) => {
    const oldGasPrice = Number(gasPriceFormatted)
    const newGasPrice = Number(txParameters.ethGasPrice)
    const oldSafeTxGas = Number(gasEstimation)
    const newSafeTxGas = Number(txParameters.safeTxGas)

    if (newGasPrice && oldGasPrice !== newGasPrice) {
      setManualGasPrice(txParameters.ethGasPrice)
    }

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  return (
    <EditableTxParameters
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <Row align="center" className={classes.heading} grow>
            <Paragraph className={classes.headingText} noMargin weight="bolder">
              Change required confirmations
            </Paragraph>
            <IconButton disableRipple onClick={onClose}>
              <Close className={classes.close} />
            </IconButton>
          </Row>
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
                        onChange={({ target }) => {
                          setEditedThreshold(parseInt(target.value))
                        }}
                        render={(props) => (
                          <>
                            <SelectField {...props} disableError>
                              {[...Array(Number(owners?.size))].map((x, index) => (
                                <MenuItem key={index} value={`${index + 1}`}>
                                  {index + 1}
                                </MenuItem>
                              ))}
                            </SelectField>
                            {props.meta.error && props.meta.touched && (
                              <Paragraph className={classes.errorText} color="error" noMargin>
                                {props.meta.error}
                              </Paragraph>
                            )}
                          </>
                        )}
                        validate={composeValidators(required, mustBeInteger, minValue(1), differentFrom(threshold))}
                      />
                    </Col>
                    <Col xs={10}>
                      <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                        {`out of ${owners?.size} owner(s)`}
                      </Paragraph>
                    </Col>
                  </Row>

                  {/* Tx Parameters */}
                  <TxParametersDetail
                    txParameters={txParameters}
                    onEdit={toggleEditMode}
                    parametersStatus={getParametersStatus()}
                    isTransactionCreation={isCreation}
                    isTransactionExecution={isExecution}
                  />
                </Block>
                {txEstimationExecutionStatus !== EstimationStatus.LOADING && (
                  <div className={classes.gasCostsContainer}>
                    <TransactionFees
                      gasCostFormatted={gasCostFormatted}
                      isExecution={isExecution}
                      isCreation={isCreation}
                      isOffChainSignature={isOffChainSignature}
                      txEstimationExecutionStatus={txEstimationExecutionStatus}
                    />
                  </div>
                )}

                <Row align="center" className={classes.buttonRow}>
                  <Button minWidth={140} onClick={onClose}>
                    Back
                  </Button>
                  <Button
                    color="primary"
                    minWidth={140}
                    type="submit"
                    variant="contained"
                    disabled={txEstimationExecutionStatus === EstimationStatus.LOADING}
                  >
                    Change
                  </Button>
                </Row>
              </>
            )}
          </GnoForm>
        </>
      )}
    </EditableTxParameters>
  )
}
