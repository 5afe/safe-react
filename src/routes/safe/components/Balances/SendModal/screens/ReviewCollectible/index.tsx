import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'

import { getExplorerInfo } from 'src/config'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { textShortener } from 'src/utils/strings'
import { generateERC721TransferTxData } from 'src/logic/collectibles/utils'

import { styles } from './style'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const useStyles = makeStyles(styles)

export type CollectibleTx = {
  recipientAddress: string
  assetAddress: string
  assetName: string
  nftTokenId: string
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: CollectibleTx
}

const ReviewCollectible = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const shortener = textShortener()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const nftTokens = useSelector(nftTokensSelector)
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const txToken = nftTokens.find(
    ({ assetAddress, tokenId }) => assetAddress === tx.assetAddress && tokenId === tx.nftTokenId,
  )
  const [data, setData] = useState('')

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
    txData: data,
    txRecipient: tx.assetAddress,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    let isCurrent = true

    const calculateERC721TransferData = async () => {
      try {
        const txData = await generateERC721TransferTxData(tx, safeAddress)
        if (isCurrent) {
          setData(txData)
        }
      } catch (error) {
        console.error('Error calculating ERC721 transfer data:', error.message)
      }
    }
    calculateERC721TransferData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, tx])

  const submitTx = (txParameters: TxParameters) => {
    try {
      if (safeAddress) {
        dispatch(
          createTransaction({
            safeAddress,
            to: tx.assetAddress,
            valueInWei: '0',
            txData: data,
            txNonce: txParameters.safeNonce,
            safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
            ethParameters: txParameters,
            notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          }),
        )
      } else {
        console.error('There was an error trying to submit the transaction, the safeAddress was not found')
      }
    } catch (error) {
      console.error('Error creating sendCollectible Tx:', error)
    } finally {
      onClose()
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
            <Paragraph className={classes.headingText} noMargin weight="bolder">
              Send collectible
            </Paragraph>
            <Paragraph className={classes.annotation}>2 of 2</Paragraph>
            <IconButton disableRipple onClick={onClose}>
              <Close className={classes.closeIcon} />
            </IconButton>
          </Row>
          <Hairline />
          <Block className={classes.container}>
            <SafeInfo />
            <Divider withArrow />
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                Recipient
              </Paragraph>
            </Row>
            <Row align="center" margin="md">
              <Col xs={12}>
                <EthHashInfo
                  hash={tx.recipientAddress}
                  showAvatar
                  showCopyBtn
                  explorerUrl={getExplorerInfo(tx.recipientAddress)}
                />
              </Col>
            </Row>
            <Row margin="xs">
              <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                {textShortener({ charsStart: 40, charsEnd: 0 })(tx.assetName)}
              </Paragraph>
            </Row>
            {txToken && (
              <Row align="center" margin="md">
                <Img alt={txToken.name} height={28} onError={setImageToPlaceholder} src={txToken.image} />
                <Paragraph className={classes.amount} noMargin size="md">
                  {shortener(txToken.name)} (Token ID: {shortener(txToken.tokenId as string)})
                </Paragraph>
              </Row>
            )}

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
                type: 'submit',
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

export default ReviewCollectible
