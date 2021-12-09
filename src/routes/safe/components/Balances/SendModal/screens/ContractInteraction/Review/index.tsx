import { useEffect, useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import {
  generateFormFieldKey,
  getValueFromTxInputs,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { useEstimateTransactionGas, EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'

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

const ContractInteractionReview = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const explorerUrl = getExplorerInfo(tx.contractAddress as string)
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const nativeCurrency = getNativeCurrency()
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const addressName = useSelector((state) => addressBookEntryName(state, { address: tx.contractAddress as string }))

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

  const doExecute = isExecution && executionApproved
  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    setTxInfo({
      txRecipient: tx.contractAddress as string,
      txAmount: tx.value ? toTokenUnit(tx.value, nativeCurrency.decimals) : '0',
      txData: tx.data ? tx.data.trim() : '',
    })
  }, [tx.contractAddress, tx.value, tx.data, safeAddress, nativeCurrency.decimals])

  const submitTx = (txParameters: TxParameters) => {
    if (safeAddress && txInfo) {
      dispatch(
        createTransaction({
          safeAddress,
          to: txInfo?.txRecipient,
          valueInWei: txInfo?.txAmount,
          txData: txInfo?.txData,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          delayExecution: !executionApproved,
        }),
      )
    } else {
      console.error('There was an error trying to submit the transaction, the safeAddress was not found')
    }
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
      isExecution={doExecute}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation}
      closeEditModalCallback={closeEditModalCallback}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <ModalHeader onClose={onClose} subTitle="2 of 2" title="Contract interaction" />
          <Hairline />
          <Block className={classes.formContainer}>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Contract Address
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <PrefixedEthHashInfo
                hash={tx.contractAddress as string}
                name={addressName}
                showAvatar
                showCopyBtn
                explorerUrl={explorerUrl}
              />
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Value
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Col xs={1}>
                <Img alt="Ether" height={28} onError={setImageToPlaceholder} src={getEthAsToken('0').logoUri || ''} />
              </Col>
              <Col layout="column" xs={11}>
                <Block justify="left">
                  <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                    {tx.value || 0}
                    {' ' + nativeCurrency.symbol}
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
                <Fragment key={key}>
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
                </Fragment>
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

            {isExecution && <ExecuteCheckbox onChange={setExecutionApproved} />}

            {/* Tx Parameters */}
            <TxParametersDetail
              txParameters={txParameters}
              onEdit={toggleEditMode}
              isTransactionCreation={isCreation}
              isTransactionExecution={doExecute}
              isOffChainSignature={isOffChainSignature}
            />
          </Block>
          <ReviewInfoText
            gasCostFormatted={gasCostFormatted}
            isCreation={isCreation}
            isExecution={doExecute}
            isOffChainSignature={isOffChainSignature}
            safeNonce={txParameters.safeNonce}
            txEstimationExecutionStatus={txEstimationExecutionStatus}
          />

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
