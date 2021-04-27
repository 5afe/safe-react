import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { sm } from 'src/theme/variables'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { useEstimateTransactionGas, EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'

import ArrowDown from '../../assets/arrow-down.svg'
import { styles } from './style'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

export type CustomTx = {
  contractAddress?: string
  data?: string
  value?: string
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: CustomTx
}

const useStyles = makeStyles(styles)

const { nativeCoin } = getNetworkInfo()

const ReviewCustomTx = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

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
    txRecipient: tx.contractAddress as string,
    txData: tx.data ? tx.data.trim() : '',
    txAmount: tx.value ? toTokenUnit(tx.value, nativeCoin.decimals) : '0',
  })

  const submitTx = async (txParameters: TxParameters): Promise<void> => {
    const txRecipient = tx.contractAddress
    const txData = tx.data ? tx.data.trim() : ''
    const txValue = tx.value ? toTokenUnit(tx.value, nativeCoin.decimals) : '0'

    if (safeAddress) {
      dispatch(
        createTransaction({
          safeAddress: safeAddress,
          to: txRecipient as string,
          valueInWei: txValue,
          txData,
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

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <Row align="center" className={classes.heading} grow>
            <Paragraph className={classes.headingText} noMargin weight="bolder">
              Contract interaction
            </Paragraph>
            <Paragraph className={classes.annotation}>2 of 2</Paragraph>
            <IconButton disableRipple onClick={onClose}>
              <Close className={classes.closeIcon} />
            </IconButton>
          </Row>
          <Hairline />
          <Block className={classes.container}>
            <SafeInfo />
            <Row margin="md">
              <Col xs={1}>
                <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
              </Col>
              <Col center="xs" layout="column" xs={11}>
                <Hairline />
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Recipient
              </Paragraph>
            </Row>

            <Row align="center" margin="md">
              <Col xs={12}>
                <EthHashInfo
                  hash={tx.contractAddress as string}
                  showAvatar
                  showCopyBtn
                  explorerUrl={getExplorerInfo(tx.contractAddress as string)}
                />
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Value
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Img alt="Ether" height={28} onError={setImageToPlaceholder} src={getEthAsToken('0').logoUri} />
              <Paragraph className={classes.value} noMargin size="md">
                {tx.value || 0}
                {' ' + nativeCoin.name}
              </Paragraph>
            </Row>
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
            <Button minWidth={140} onClick={onPrev} color="secondary">
              Back
            </Button>
            <Button
              className={classes.submitButton}
              color="primary"
              data-testid="submit-tx-btn"
              minWidth={140}
              onClick={() => submitTx(txParameters)}
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

export default ReviewCustomTx
