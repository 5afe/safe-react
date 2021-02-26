import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ExplorerButton } from '@gnosis.pm/safe-react-components'
import { List } from 'immutable'

import { getExplorerInfo } from 'src/config'
import CopyBtn from 'src/components/CopyBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { safeNameSelector, safeOwnersSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { getOwnersWithNameFromAddressBook } from 'src/logic/addressBook/utils'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

import { styles } from './style'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

export const REMOVE_OWNER_REVIEW_BTN_TEST_ID = 'remove-owner-review-btn'

const useStyles = makeStyles(styles)

type ReviewRemoveOwnerProps = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters) => void
  ownerAddress: string
  ownerName: string
  threshold?: number
}

export const ReviewRemoveOwnerModal = ({
  onClickBack,
  onClose,
  onSubmit,
  ownerAddress,
  ownerName,
  threshold = 1,
}: ReviewRemoveOwnerProps): React.ReactElement => {
  const classes = useStyles()
  const [data, setData] = useState('')
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const owners = useSelector(safeOwnersSelector)
  const addressBook = useSelector(addressBookSelector)
  const ownersWithAddressBookName = owners ? getOwnersWithNameFromAddressBook(addressBook, owners) : List([])
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()

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
  })

  useEffect(() => {
    let isCurrent = true

    if (!threshold) {
      console.error("Threshold value was not define, tx can't be executed")
      return
    }

    const calculateRemoveOwnerData = async () => {
      try {
        const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
        const safeOwners = await gnosisSafe.methods.getOwners().call()
        const index = safeOwners.findIndex((owner) => owner.toLowerCase() === ownerAddress.toLowerCase())
        const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
        const txData = gnosisSafe.methods.removeOwner(prevAddress, ownerAddress, threshold).encodeABI()

        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        console.error('Error calculating ERC721 transfer data:', error.message)
      }
    }
    calculateRemoveOwnerData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, ownerAddress, threshold])

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
            <Paragraph className={classes.manage} noMargin weight="bolder">
              Remove owner
            </Paragraph>
            <Paragraph className={classes.annotation}>3 of 3</Paragraph>
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
                      {`${threshold} out of ${owners ? owners.size - 1 : 0} owner(s)`}
                    </Paragraph>
                  </Block>
                </Block>
              </Col>
              <Col className={classes.owners} layout="column" xs={8}>
                <Row className={classes.ownersTitle}>
                  <Paragraph color="primary" noMargin size="lg">
                    {`${owners ? owners.size - 1 : 0} Safe owner(s)`}
                  </Paragraph>
                </Row>
                <Hairline />
                {ownersWithAddressBookName?.map(
                  (owner) =>
                    owner.address !== ownerAddress && (
                      <React.Fragment key={owner.address}>
                        <Row className={classes.owner}>
                          <Col align="center" xs={1}>
                            <Identicon address={owner.address} diameter={32} />
                          </Col>
                          <Col xs={11}>
                            <Block className={classNames(classes.name, classes.userName)}>
                              <Paragraph noMargin size="lg" weight="bolder">
                                {owner.name}
                              </Paragraph>
                              <Block className={classes.user} justify="center">
                                <Paragraph className={classes.address} color="disabled" noMargin size="md">
                                  {owner.address}
                                </Paragraph>
                                <CopyBtn content={owner.address} />
                                <ExplorerButton explorerUrl={getExplorerInfo(owner.address)} />
                              </Block>
                            </Block>
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
                <Row className={classes.selectedOwner}>
                  <Col align="center" xs={1}>
                    <Identicon address={ownerAddress} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size="lg" weight="bolder">
                        {ownerName}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph className={classes.address} color="disabled" noMargin size="md">
                          {ownerAddress}
                        </Paragraph>
                        <CopyBtn content={ownerAddress} />
                        <ExplorerButton explorerUrl={getExplorerInfo(ownerAddress)} />
                      </Block>
                    </Block>
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
          />

          {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
            <Block className={classes.gasCostsContainer}>
              <TransactionFees
                gasCostFormatted={gasCostFormatted}
                isExecution={isExecution}
                isCreation={isCreation}
                isOffChainSignature={isOffChainSignature}
                txEstimationExecutionStatus={txEstimationExecutionStatus}
              />
            </Block>
          )}
          <Row align="center" className={classes.buttonRow}>
            <Button minHeight={42} minWidth={140} onClick={onClickBack}>
              Back
            </Button>
            <Button
              color="primary"
              minHeight={42}
              minWidth={140}
              onClick={() => onSubmit(txParameters)}
              testId={REMOVE_OWNER_REVIEW_BTN_TEST_ID}
              type="submit"
              variant="contained"
              disabled={txEstimationExecutionStatus === EstimationStatus.LOADING}
            >
              Submit
            </Button>
          </Row>
        </>
      )}
    </EditableTxParameters>
  )
}
