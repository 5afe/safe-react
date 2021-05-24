import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import { getNetworkInfo, getExplorerInfo } from 'src/config'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { Header } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Header'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import {
  generateFormFieldKey,
  getValueFromTxInputs,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { useEstimateTransactionGas, EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

const useStyles = makeStyles(styles)

export type TransactionReviewType = {
  abi?: string
  contractAddress?: string
  data?: string
  value?: string
  selectedMethod?: AbiItemExtended
}

type Props = {
  onClose: () => void
  onPrev: () => void
  onEditTxParameters: () => void
  tx: TransactionReviewType
  txParameters: TxParameters
}

const { nativeCoin } = getNetworkInfo()

const ContractInteractionReview = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const explorerUrl = getExplorerInfo(tx.contractAddress as string)
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const [txInfo, setTxInfo] = useState<{
    txRecipient: string
    txData: string
    txAmount: string
  }>({ txData: '', txAmount: '', txRecipient: '' })

  const {
    gasLimit,
    gasEstimation,
    gasPriceFormatted,
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isOffChainSignature,
    isCreation,
  } = useEstimateTransactionGas({
    txRecipient: txInfo?.txRecipient,
    txAmount: txInfo?.txAmount,
    txData: txInfo?.txData,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    setTxInfo({
      txRecipient: tx.contractAddress as string,
      txAmount: tx.value ? toTokenUnit(tx.value, nativeCoin.decimals) : '0',
      txData: tx.data ? tx.data.trim() : '',
    })
  }, [tx.contractAddress, tx.value, tx.data, safeAddress])

  const submitTx = (txParameters: TxParameters) => {
    if (safeAddress && txInfo) {
      dispatch(
        createTransaction({
          safeAddress,
          to: txInfo?.txRecipient,
          valueInWei: txInfo?.txAmount,
          txData: txInfo?.txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        }),
      )
    } else {
      console.error('There was an error trying to submit the transaction, the safeAddress was not found')
    }
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
          <Header onClose={onClose} subTitle="2 of 2" title="Contract interaction" />
          <Hairline />
          <Block className={classes.formContainer}>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Contract Address
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <EthHashInfo hash={tx.contractAddress as string} showAvatar showCopyBtn explorerUrl={explorerUrl} />
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Value
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Col xs={1}>
                <Img alt="Ether" height={28} onError={setImageToPlaceholder} src={getEthAsToken('0').logoUri} />
              </Col>
              <Col layout="column" xs={11}>
                <Block justify="left">
                  <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                    {tx.value || 0}
                    {' ' + nativeCoin.name}
                  </Paragraph>
                </Block>
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Method
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Paragraph className={classes.value} size="md" style={{ margin: 0 }}>
                {tx.selectedMethod?.name}
              </Paragraph>
            </Row>
            {tx.selectedMethod?.inputs?.map(({ name, type }, index) => {
              const key = generateFormFieldKey(type, tx.selectedMethod?.signatureHash || '', index)
              const value: string = getValueFromTxInputs(key, type, tx)

              return (
                <React.Fragment key={key}>
                  <Row margin="xs">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      {name} ({type})
                    </Paragraph>
                  </Row>
                  <Row align="center" margin="md">
                    <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                      {value}
                    </Paragraph>
                  </Row>
                </React.Fragment>
              )
            })}
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Data (hex encoded)
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Col className={classes.outerData}>
                <Row className={classes.data} size="md">
                  {tx.data}
                </Row>
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
          <div className={classes.gasCostsContainer}>
            <TransactionFees
              gasCostFormatted={gasCostFormatted}
              isExecution={isExecution}
              isCreation={isCreation}
              isOffChainSignature={isOffChainSignature}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          </div>

          <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onPrev, text: 'Back' }}
              confirmButtonProps={{
                onClick: () => submitTx(txParameters),
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
                testId: 'submit-tx-btn',
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}

export default ContractInteractionReview
