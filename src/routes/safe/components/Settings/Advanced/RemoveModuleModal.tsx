import { Button } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import { getExplorerInfo } from 'src/config'
import { getDisableModuleTxData } from 'src/logic/safe/utils/modules'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'

import { ModulePair } from 'src/logic/safe/store/models/safe'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { md, secondary } from 'src/theme/variables'

import { styles } from './style'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const useStyles = makeStyles(styles)

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const openIconStyle = {
  height: md,
  color: secondary,
}

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

  const [, moduleAddress] = selectedModulePair
  const explorerInfo = getExplorerInfo(moduleAddress)
  const { url } = explorerInfo()

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
  })

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

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  return (
    <Modal
      description="Remove the selected Module"
      handleClose={onClose}
      paperClassName={classes.modal}
      title="Remove Module"
      open
    >
      <EditableTxParameters
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
                  Remove Module
                </Paragraph>
                <IconButton disableRipple onClick={onClose}>
                  <Close className={classes.modalClose} />
                </IconButton>
              </Row>
              <Hairline />
              <Block>
                <Row className={classes.modalOwner}>
                  <Col align="center" xs={1}>
                    <Identicon address={moduleAddress} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={cn(classes.modalName, classes.modalUserName)}>
                      <Paragraph noMargin size="lg" weight="bolder">
                        {moduleAddress}
                      </Paragraph>
                      <Block className={classes.modalUser} justify="center">
                        <Paragraph color="disabled" noMargin size="md">
                          {moduleAddress}
                        </Paragraph>
                        <Link className={classes.modalOpen} target="_blank" to={url}>
                          <OpenInNew style={openIconStyle} />
                        </Link>
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
                <Row className={classes.modalDescription}>
                  <Paragraph noMargin>
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
              <Row align="center" className={classes.modalButtonRow}>
                <FooterWrapper>
                  <Button size="md" color="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="error"
                    size="md"
                    variant="contained"
                    disabled={!txData || txEstimationExecutionStatus === EstimationStatus.LOADING}
                    onClick={() => removeSelectedModule(txParameters)}
                  >
                    Remove
                  </Button>
                </FooterWrapper>
              </Row>
            </>
          )
        }}
      </EditableTxParameters>
    </Modal>
  )
}
