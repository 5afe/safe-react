import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { getNetworkInfo } from 'src/config'
import { styles } from './style'

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
import { List } from 'immutable'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info_red.svg'

const THRESHOLD_FIELD_NAME = 'threshold'

const { nativeCoin } = getNetworkInfo()

const useStyles = makeStyles(styles)

type ChangeThresholdModalProps = {
  onChangeThreshold: (newThreshold: number) => void
  onClose: () => void
  owners?: List<SafeOwner>
  safeAddress: string
  threshold?: number
}

export const ChangeThresholdModal = ({
  onChangeThreshold,
  onClose,
  owners,
  safeAddress,
  threshold = 1,
}: ChangeThresholdModalProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')

  const { gasCosts, txEstimationExecutionStatus } = useEstimateTransactionGas({
    txData: data,
    safeAddress,
    txRecipient: safeAddress,
  })

  useEffect(() => {
    let isCurrent = true
    const calculateChangeThresholdData = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      const txData = safeInstance.methods.changeThreshold(threshold).encodeABI()
      if (isCurrent) {
        setData(txData)
      }
    }

    calculateChangeThresholdData()
    return () => {
      isCurrent = false
    }
  }, [safeAddress, threshold])

  const handleSubmit = (values) => {
    const newThreshold = values[THRESHOLD_FIELD_NAME]

    onClose()
    onChangeThreshold(newThreshold)
  }

  return (
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
      <GnoForm initialValues={{ threshold: threshold.toString() }} onSubmit={handleSubmit}>
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
              <Row>
                <Paragraph>
                  {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
                </Paragraph>
                {txEstimationExecutionStatus === EstimationStatus.FAILURE && (
                  <Row align="center">
                    <Paragraph color="error" className={classes.executionWarningRow}>
                      <Img alt="Info Tooltip" height={16} src={InfoIcon} className={classes.warningIcon} />
                      This transaction will most likely fail. To save gas costs, avoid creating the transaction.
                    </Paragraph>
                  </Row>
                )}
              </Row>
            </Block>
            <Hairline style={{ position: 'absolute', bottom: 85 }} />
            <Row align="center" className={classes.buttonRow}>
              <Button minWidth={140} onClick={onClose}>
                Back
              </Button>
              <Button color="primary" minWidth={140} type="submit" variant="contained">
                Change
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}
