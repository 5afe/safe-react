import React, { useEffect, useMemo, useState } from 'react'
import { Text, EthHashInfo, ModalFooterConfirmation } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import TextBox from 'src/components/TextBox'
import ModalTitle from 'src/components/ModalTitle'
import Heading from 'src/components/layout/Heading'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { DELEGATE_CALL, TX_NOTIFICATION_TYPES, CALL } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { getNetworkInfo } from 'src/config'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { md, lg, sm } from 'src/theme/variables'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { DecodeTxs, BasicTxInfo } from 'src/components/DecodeTxs'
import { fetchTxDecoder } from 'src/utils/decodeTx'
import { DecodedData } from 'src/types/transactions/decode.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getExplorerInfo } from 'src/config'
import Block from 'src/components/layout/Block'
import Divider from 'src/components/Divider'

import GasEstimationInfo from '../GasEstimationInfo'
import { ConfirmTxModalProps, DecodedTxDetail } from '.'
import Hairline from 'src/components/layout/Hairline'

const { nativeCoin } = getNetworkInfo()

const StyledTextBox = styled(TextBox)`
  max-width: 444px;
`

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg} 0;
`
const TransactionFeesWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${sm} ${lg};
  margin-bottom: 15px;
`

const FooterWrapper = styled.div`
  margin-bottom: 15px;
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
  showDecodedTxData,
}: Props): React.ReactElement => {
  const [estimatedSafeTxGas, setEstimatedSafeTxGas] = useState(0)
  const isMultiSend = txs.length > 1
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null)
  const dispatch = useDispatch()
  const explorerUrl = getExplorerInfo(safeAddress)

  const txRecipient: string | undefined = useMemo(() => (isMultiSend ? MULTI_SEND_ADDRESS : txs[0]?.to), [
    txs,
    isMultiSend,
  ])
  const txData: string | undefined = useMemo(() => (isMultiSend ? encodeMultiSendCall(txs) : txs[0]?.data), [
    txs,
    isMultiSend,
  ])
  const txValue: string | undefined = useMemo(
    () => (isMultiSend ? '0' : txs[0]?.value && parseTxValue(txs[0]?.value)),
    [txs, isMultiSend],
  )
  const operation = useMemo(() => (isMultiSend ? DELEGATE_CALL : CALL), [isMultiSend])
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
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

  useEffect(() => {
    if (params?.safeTxGas) {
      setEstimatedSafeTxGas(gasEstimation)
    }
  }, [params, gasEstimation])

  // Decode tx data.
  useEffect(() => {
    const decodeTxData = async () => {
      const res = await fetchTxDecoder(txData)
      setDecodedData(res)
    }

    decodeTxData()
  }, [txData])

  const handleTxRejection = () => {
    onTxReject()
    onClose()
  }

  const handleUserConfirmation = (safeTxHash: string): void => {
    onUserConfirm(safeTxHash)
    onClose()
  }

  const confirmTransactions = async (txParameters: TxParameters) => {
    await dispatch(
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
          safeTxGas: txParameters.safeTxGas
            ? Number(txParameters.safeTxGas)
            : Math.max(params?.safeTxGas || 0, estimatedSafeTxGas),
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        },
        handleUserConfirmation,
        handleTxRejection,
      ),
    )
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
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
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
            {/* Warning gas estimation */}
            {params?.safeTxGas && (
              <div className="section">
                <Heading tag="h3">SafeTxGas</Heading>
                <StyledTextBox>{params?.safeTxGas}</StyledTextBox>
                <GasEstimationInfo
                  appEstimation={params.safeTxGas}
                  internalEstimation={estimatedSafeTxGas}
                  loading={txEstimationExecutionStatus === EstimationStatus.LOADING}
                />
              </div>
            )}
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
                gasCostFormatted={gasCostFormatted}
                isExecution={isExecution}
                isCreation={isCreation}
                isOffChainSignature={isOffChainSignature}
                txEstimationExecutionStatus={txEstimationExecutionStatus}
              />
            </TransactionFeesWrapper>
          )}

          {/* Buttons */}
          <FooterWrapper>
            <ModalFooterConfirmation
              cancelText="Cancel"
              handleCancel={handleTxRejection}
              handleOk={() => confirmTransactions(txParameters)}
              okDisabled={areTxsMalformed}
              okText="Submit"
            />
          </FooterWrapper>
        </div>
      )}
    </EditableTxParameters>
  )
}
