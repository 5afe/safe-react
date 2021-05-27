import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { List } from 'immutable'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

import { getExplorerInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import {
  safeNameSelector,
  safeOwnersSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'
import { getOwnersWithNameFromAddressBook } from 'src/logic/addressBook/utils'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Modal } from 'src/components/Modal'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

import { useStyles } from './style'

export const REPLACE_OWNER_SUBMIT_BTN_TEST_ID = 'replace-owner-submit-btn'

type ReplaceOwnerProps = {
  onClose: () => void
  onClickBack: () => void
  onSubmit: (txParameters: TxParameters) => void
  ownerAddress: string
  ownerName: string
  values: {
    newOwnerAddress: string
    newOwnerName: string
  }
}

export const ReviewReplaceOwnerModal = ({
  onClickBack,
  onClose,
  onSubmit,
  ownerAddress,
  ownerName,
  values,
}: ReplaceOwnerProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const owners = useSelector(safeOwnersSelector)
  const threshold = useSelector(safeThresholdSelector) || 1
  const addressBook = useSelector(addressBookSelector)
  const ownersWithAddressBookName = owners ? getOwnersWithNameFromAddressBook(addressBook, owners) : List([])
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const {
    gasLimit,
    gasEstimation,
    gasPriceFormatted,
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
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
    const calculateReplaceOwnerData = async () => {
      const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
      const safeOwners = await gnosisSafe.methods.getOwners().call()
      const index = safeOwners.findIndex((owner) => owner.toLowerCase() === ownerAddress.toLowerCase())
      const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
      const txData = gnosisSafe.methods.swapOwner(prevAddress, ownerAddress, values.newOwnerAddress).encodeABI()
      if (isCurrent) {
        setData(txData)
      }
    }

    calculateReplaceOwnerData()
    return () => {
      isCurrent = false
    }
  }, [ownerAddress, safeAddress, values.newOwnerAddress])

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

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <Row align="center" className={classes.heading} grow>
            <Paragraph className={classes.manage} noMargin weight="bolder">
              Replace owner
            </Paragraph>
            <Paragraph className={classes.annotation}>2 of 2</Paragraph>
            <IconButton disableRipple onClick={onClose}>
              <Close className={classes.closeIcon} />
            </IconButton>
          </Row>
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
                      {`${threshold} out of ${owners?.size || 0} owner(s)`}
                    </Paragraph>
                  </Block>
                </Block>
              </Col>
              <Col className={classes.owners} layout="column" xs={8}>
                <Row className={classes.ownersTitle}>
                  <Paragraph color="primary" noMargin size="lg">
                    {`${owners?.size || 0} Safe owner(s)`}
                  </Paragraph>
                </Row>
                <Hairline />
                {ownersWithAddressBookName?.map(
                  (owner) =>
                    owner.address !== ownerAddress && (
                      <React.Fragment key={owner.address}>
                        <Row className={classes.owner}>
                          <Col align="center" xs={12}>
                            <EthHashInfo
                              hash={owner.address}
                              name={owner.name}
                              showCopyBtn
                              showAvatar
                              explorerUrl={getExplorerInfo(owner.address)}
                            />
                          </Col>
                        </Row>
                        <Hairline />
                      </React.Fragment>
                    ),
                )}
                <Row align="center" className={classes.info}>
                  <Paragraph color="primary" noMargin size="md" weight="bolder">
                    REMOVING OWNER &darr;
                  </Paragraph>
                </Row>
                <Hairline />
                <Row className={classes.selectedOwnerRemoved}>
                  <Col align="center" xs={12}>
                    <EthHashInfo
                      hash={ownerAddress}
                      name={ownerName}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(ownerAddress)}
                    />
                  </Col>
                </Row>
                <Row align="center" className={classes.info}>
                  <Paragraph color="primary" noMargin size="md" weight="bolder">
                    ADDING NEW OWNER &darr;
                  </Paragraph>
                </Row>
                <Hairline />
                <Row className={classes.selectedOwnerAdded}>
                  <Col align="center" xs={12}>
                    <EthHashInfo
                      hash={values.newOwnerAddress}
                      name={values.newOwnerName}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(values.newOwnerAddress)}
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

          <Block className={classes.gasCostsContainer}>
            <TransactionFees
              gasCostFormatted={gasCostFormatted}
              isExecution={isExecution}
              isCreation={isCreation}
              isOffChainSignature={isOffChainSignature}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          </Block>
          <Modal.Footer withoutBorder>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onClickBack, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => onSubmit(txParameters),
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                type: 'submit',
                testId: REPLACE_OWNER_SUBMIT_BTN_TEST_ID,
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
