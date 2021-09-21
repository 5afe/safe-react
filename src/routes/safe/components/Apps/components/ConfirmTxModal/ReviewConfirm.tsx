import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import ModalTitle from 'src/components/ModalTitle'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { lg, md, sm } from 'src/theme/variables'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { BasicTxInfo, DecodeTxs } from 'src/components/DecodeTxs'
import { fetchTxDecoder } from 'src/utils/decodeTx'
import { DecodedData } from 'src/types/transactions/decode.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Divider from 'src/components/Divider'

import { ConfirmTxModalProps, DecodedTxDetail } from '.'
import Hairline from 'src/components/layout/Hairline'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { grantedSelector } from 'src/routes/safe/container/selector'

const { nativeCoin } = getNetworkInfo()

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg} 0;
`
const TransactionFeesWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${sm} ${lg};
`

const DecodeTxsWrapper = styled.div`
  margin: 24px -24px;
`

const StyledBlock = styled(Block)`
  background-color: ${({ theme }) => theme.colors.separator};
  width: fit-content;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 4px 0 0 40px;

  display: flex;

  > :nth-child(1) {
    margin-right: 5px;
  }
`

type Props = ConfirmTxModalProps & {
  areTxsMalformed: boolean
  showDecodedTxData: (decodedTxDetails: DecodedTxDetail) => void
  hidden: boolean // used to prevent re-rendering the modal each time a tx is inspected
}

const parseTxValue = (value: string | number): string => {
  return web3ReadOnly.utils.toBN(value).toString()
}

export const ReviewConfirm = ({
  app,
  txs,
  safeAddress,
  ethBalance,
  safeName,
  params,
  hidden,
  onUserConfirm,
  onClose,
  onTxReject,
  areTxsMalformed,
  requestId,
  showDecodedTxData,
}: Props): ReactElement => {
  const isMultiSend = txs.length > 1
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null)
  const dispatch = useDispatch()
  const explorerUrl = getExplorerInfo(safeAddress)
  const isOwner = useSelector(grantedSelector)

  const txRecipient: string | undefined = useMemo(
    () => (isMultiSend ? getMultisendContractAddress() : txs[0]?.to),
    [txs, isMultiSend],
  )
  const txData: string | undefined = useMemo(
    () => (isMultiSend ? encodeMultiSendCall(txs) : txs[0]?.data),
    [txs, isMultiSend],
  )
  const txValue: string | undefined = useMemo(
    // Value is converted to string because numbers were allowed in the safe-apps-sdk v1, so 0 and anything would evaluate as false
    () => (isMultiSend ? '0' : txs[0]?.value.toString() && parseTxValue(txs[0]?.value)),
    [txs, isMultiSend],
  )
  const operation = useMemo(() => (isMultiSend ? Operation.DELEGATE : Operation.CALL), [isMultiSend])
  const [manualSafeTxGas, setManualSafeTxGas] = useState('0')
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()
  const [manualGasLimit, setManualGasLimit] = useState<string | undefined>()

  const {
    gasLimit,
    gasPriceFormatted,
    gasEstimation,
    isOffChainSignature,
    isCreation,
    isExecution,
    gasCostFormatted,
    txEstimationExecutionStatus,
  } = useEstimateTransactionGas({
    txData: txData || '',
    txRecipient,
    operation,
    txAmount: txValue,
    safeTxGas: manualSafeTxGas,
    manualGasPrice,
    manualGasLimit,
  })

  const [buttonStatus, setButtonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  // Decode tx data.
  useEffect(() => {
    const decodeTxData = async () => {
      const res = await fetchTxDecoder(txData)
      setDecodedData(res)
    }

    decodeTxData()
  }, [txData])

  const handleTxRejection = () => {
    onTxReject(requestId)
    onClose()
  }

  const handleUserConfirmation = (safeTxHash: string): void => {
    onUserConfirm(safeTxHash, requestId)
    onClose()
  }

  const confirmTransactions = (txParameters: TxParameters) => {
    setButtonStatus(ButtonStatus.LOADING)

    dispatch(
      createTransaction(
        {
          safeAddress,
          to: txRecipient,
          valueInWei: txValue,
          txData,
          operation,
          origin: app.id,
          navigateToTransactionsTab: false,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        },
        handleUserConfirmation,
        handleTxRejection,
      ),
    )

    setButtonStatus(ButtonStatus.READY)
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
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={Math.max(parseInt(gasEstimation), params?.safeTxGas || 0).toString()}
      closeEditModalCallback={closeEditModalCallback}
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
    >
      {(txParameters, toggleEditMode) => (
        <div hidden={hidden}>
          <ModalTitle title={app.name} iconUrl={app.iconUrl} onClose={handleTxRejection} />

          <Hairline />

          <Container>
            {/* Safe */}
            <EthHashInfo name={safeName} hash={safeAddress} showAvatar showCopyBtn explorerUrl={explorerUrl} />
            <StyledBlock>
              <Text size="md">Balance:</Text>
              <Text size="md" strong>{`${ethBalance} ${nativeCoin.symbol}`}</Text>
            </StyledBlock>

            <Divider withArrow />

            {/* Txs decoded */}
            <BasicTxInfo
              txRecipient={txRecipient}
              txData={txData}
              txValue={fromTokenUnit(txValue, nativeCoin.decimals)}
            />

            <DecodeTxsWrapper>
              <DecodeTxs txs={txs} decodedData={decodedData} onTxItemClick={showDecodedTxData} />
            </DecodeTxsWrapper>
            {!isMultiSend && <Divider />}
            {/* Tx Parameters */}
            <TxParametersDetail
              txParameters={txParameters}
              onEdit={toggleEditMode}
              isTransactionCreation={isCreation}
              isTransactionExecution={isExecution}
              isOffChainSignature={isOffChainSignature}
            />
          </Container>

          {/* Gas info */}
          {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
            <TransactionFeesWrapper>
              <TransactionFees
                gasCostFormatted={isOwner ? gasCostFormatted : undefined}
                isExecution={isExecution}
                isCreation={isCreation}
                isOffChainSignature={isOffChainSignature}
                txEstimationExecutionStatus={txEstimationExecutionStatus}
              />
            </TransactionFeesWrapper>
          )}

          {/* Buttons */}
          <Modal.Footer withoutBorder={txEstimationExecutionStatus !== EstimationStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: handleTxRejection }}
              confirmButtonProps={{
                onClick: () => confirmTransactions(txParameters),
                disabled: !isOwner || areTxsMalformed,
                status: buttonStatus,
                text: txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : undefined,
              }}
            />
          </Modal.Footer>
        </div>
      )}
    </EditableTxParameters>
  )
}
