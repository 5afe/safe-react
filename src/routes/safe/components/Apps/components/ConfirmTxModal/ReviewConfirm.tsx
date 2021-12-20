import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toBN } from 'web3-utils'
import { DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { lg, md } from 'src/theme/variables'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { BasicTxInfo, DecodeTxs } from 'src/components/DecodeTxs'
import { fetchTxDecoder } from 'src/utils/decodeTx'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Divider from 'src/components/Divider'
import { ButtonStatus, Modal } from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ReviewInfoText } from 'src/components/ReviewInfoText'

import { ConfirmTxModalProps, DecodedTxDetail } from '.'
import { grantedSelector } from 'src/routes/safe/container/selector'
import ExecuteCheckbox from 'src/components/ExecuteCheckbox'

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg} 0;
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
  onReject: () => void
  showDecodedTxData: (decodedTxDetails: DecodedTxDetail) => void
  hidden: boolean // used to prevent re-rendering the modal each time a tx is inspected
}

const parseTxValue = (value: string | number): string => {
  return toBN(value).toString()
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
  onReject,
  requestId,
  showDecodedTxData,
}: Props): ReactElement => {
  const isMultiSend = txs.length > 1
  const [decodedData, setDecodedData] = useState<DecodedDataResponse | null>(null)
  const dispatch = useDispatch()
  const nativeCurrency = getNativeCurrency()
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
    () => (isMultiSend ? '0' : parseTxValue(txs[0]?.value)),
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
  const [executionApproved, setExecutionApproved] = useState<boolean>(true)
  const doExecute = isExecution && executionApproved

  // Decode tx data.
  useEffect(() => {
    const decodeTxData = async () => {
      const res = await fetchTxDecoder(txData)
      setDecodedData(res)
    }

    decodeTxData()
  }, [txData])

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
          delayExecution: !executionApproved,
        },
        handleUserConfirmation,
        onReject,
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
      isExecution={doExecute}
    >
      {(txParameters, toggleEditMode) => (
        <div hidden={hidden}>
          <ModalHeader title={app.name} iconUrl={app.iconUrl} onClose={onReject} />

          <Hairline />

          <Container>
            {/* Safe */}
            <PrefixedEthHashInfo name={safeName} hash={safeAddress} showAvatar showCopyBtn explorerUrl={explorerUrl} />
            <StyledBlock>
              <Text size="md">Balance:</Text>
              <Text size="md" strong>{`${ethBalance} ${nativeCurrency.symbol}`}</Text>
            </StyledBlock>

            <Divider withArrow />

            {/* Txs decoded */}
            <BasicTxInfo
              txRecipient={txRecipient}
              txData={txData}
              txValue={fromTokenUnit(txValue, nativeCurrency.decimals)}
            />

            <DecodeTxsWrapper>
              <DecodeTxs txs={txs} decodedData={decodedData} onTxItemClick={showDecodedTxData} />
            </DecodeTxsWrapper>

            {!isMultiSend && <Divider />}

            {isExecution && <ExecuteCheckbox onChange={setExecutionApproved} />}

            {/* Tx Parameters */}
            <TxParametersDetail
              txParameters={txParameters}
              onEdit={toggleEditMode}
              isTransactionCreation={isCreation}
              isTransactionExecution={doExecute}
              isOffChainSignature={isOffChainSignature}
            />
          </Container>

          {/* Gas info */}
          {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
            <ReviewInfoText
              gasCostFormatted={isOwner ? gasCostFormatted : undefined}
              isCreation={isCreation}
              isExecution={doExecute}
              isOffChainSignature={isOffChainSignature}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}

          {/* Buttons */}
          <Modal.Footer withoutBorder={txEstimationExecutionStatus !== EstimationStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: onReject }}
              confirmButtonProps={{
                onClick: () => confirmTransactions(txParameters),
                disabled: !isOwner,
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
