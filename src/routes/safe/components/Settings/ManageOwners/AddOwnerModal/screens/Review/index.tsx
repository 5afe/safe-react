import { makeStyles } from '@material-ui/core/styles'
import { ReactElement, useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'

import { OwnerValues } from '../..'
import { styles } from './style'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

export const ADD_OWNER_SUBMIT_BTN_TEST_ID = 'add-owner-submit-btn'

const useStyles = makeStyles(styles)

type ReviewAddOwnerProps = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters) => void
  values: OwnerValues
}

export const ReviewAddOwner = ({ onClickBack, onClose, onSubmit, values }: ReviewAddOwnerProps): ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const {
    address: safeAddress,
    name: safeName,
    owners,
    currentVersion: safeVersion,
  } = useSelector(currentSafeWithNames)
  const connectedWalletAddress = useSelector(userAccountSelector)
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const {
    gasLimit,
    gasEstimation,
    gasCostFormatted,
    gasPriceFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
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

    const calculateAddOwnerData = async () => {
      try {
        const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
        const safeTx = await sdk.getAddOwnerTx(
          { ownerAddress: values.ownerAddress, threshold: +values.threshold },
          { safeTxGas: 0 },
        )
        const txData = safeTx.data.data

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        logError(Errors._811, error.message)
      }
    }
    calculateAddOwnerData()

    return () => {
      isCurrent = false
    }
  }, [connectedWalletAddress, safeAddress, safeVersion, values.ownerAddress, values.threshold])

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
          <ModalHeader onClose={onClose} title="Add new owner" subTitle="3 of 3" />
          <Hairline />
          <Block>
            <Row className={classes.root}>
              <Col layout="column" xs={4}>
                <Block className={classes.details}>
                  <Block margin="lg">
                    <Paragraph color="primary" noMargin size="lg">
                      Details
                    </Paragraph>
                  </Block>
                  <Block margin="lg">
                    <Paragraph color="disabled" noMargin size="sm">
                      Safe name
                    </Paragraph>
                    <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                      {safeName}
                    </Paragraph>
                  </Block>
                  <Block margin="lg">
                    <Paragraph color="disabled" noMargin size="sm">
                      Any transaction requires the confirmation of:
                    </Paragraph>
                    <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                      {`${values.threshold} out of ${(owners?.length || 0) + 1} owner(s)`}
                    </Paragraph>
                  </Block>
                </Block>
              </Col>
              <Col className={classes.owners} layout="column" xs={8}>
                <Row className={classes.ownersTitle}>
                  <Paragraph color="primary" noMargin size="lg">
                    {`${(owners?.length || 0) + 1} Safe owner(s)`}
                  </Paragraph>
                </Row>
                <Hairline />
                {owners?.map((owner) => (
                  <Fragment key={owner.address}>
                    <Row className={classes.owner}>
                      <Col align="center" xs={12}>
                        <PrefixedEthHashInfo
                          hash={owner.address}
                          name={owner.name}
                          showCopyBtn
                          showAvatar
                          explorerUrl={getExplorerInfo(owner.address)}
                        />
                      </Col>
                    </Row>
                    <Hairline />
                  </Fragment>
                ))}
                <Row align="center" className={classes.info}>
                  <Paragraph color="primary" noMargin size="md" weight="bolder">
                    ADDING NEW OWNER &darr;
                  </Paragraph>
                </Row>
                <Hairline />
                <Row className={classes.selectedOwner} data-testid="add-owner-review">
                  <Col align="center" xs={12}>
                    <PrefixedEthHashInfo
                      hash={values.ownerAddress}
                      name={values.ownerName}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(values.ownerAddress)}
                    />
                  </Col>
                </Row>
                <Hairline />
              </Col>
            </Row>
          </Block>
          <Hairline />

          {/* Tx Parameters */}
          <TxParametersDetail
            txParameters={txParameters}
            onEdit={toggleEditMode}
            compact={false}
            isTransactionCreation={isCreation}
            isTransactionExecution={isExecution}
            isOffChainSignature={isOffChainSignature}
          />

          <ReviewInfoText
            gasCostFormatted={gasCostFormatted}
            isCreation={isCreation}
            isExecution={isExecution}
            isOffChainSignature={isOffChainSignature}
            safeNonce={txParameters.safeNonce}
            txEstimationExecutionStatus={txEstimationExecutionStatus}
          />
          <Hairline />
          <Row align="center" className={classes.buttonRow}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onClickBack, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => onSubmit(txParameters),
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                testId: ADD_OWNER_SUBMIT_BTN_TEST_ID,
              }}
            />
          </Row>
        </>
      )}
    </EditableTxParameters>
  )
}
