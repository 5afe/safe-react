import React, { useEffect, useMemo, useState } from 'react'
import { Icon, ModalFooterConfirmation, Text, Title } from '@gnosis.pm/safe-react-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import AddressInfo from 'src/components/AddressInfo'
import DividerLine from 'src/components/DividerLine'
import Collapse from 'src/components/Collapse'
import TextBox from 'src/components/TextBox'
import ModalTitle from 'src/components/ModalTitle'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import Bold from 'src/components/layout/Bold'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { DELEGATE_CALL, TX_NOTIFICATION_TYPES, CALL } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

import GasEstimationInfo from './GasEstimationInfo'
import { getNetworkInfo } from 'src/config'
import { TransactionParams } from './AppFrame'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { safeThresholdSelector } from 'src/logic/safe/store/selectors'
import Modal from 'src/components/Modal'
import Row from 'src/components/layout/Row'
import Hairline from 'src/components/layout/Hairline'
import { TransactionFees } from 'src/components/TransactionsFees'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { md, lg, sm } from 'src/theme/variables'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const isTxValid = (t: Transaction): boolean => {
  if (!['string', 'number'].includes(typeof t.value)) {
    return false
  }

  if (typeof t.value === 'string' && !/^(0x)?[0-9a-f]+$/i.test(t.value)) {
    return false
  }

  const isAddressValid = mustBeEthereumAddress(t.to) === undefined
  return isAddressValid && !!t.data && typeof t.data === 'string'
}

const Wrapper = styled.div`
  margin-bottom: 15px;
`
const CollapseContent = styled.div`
  padding: 15px 0;

  .section {
    margin-bottom: 15px;
  }

  .value-section {
    display: flex;
    align-items: center;
  }
`

const IconText = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
`
const StyledTextBox = styled(TextBox)`
  max-width: 444px;
`

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg};
`

const ModalFooter = styled(Row)`
  padding: ${md} ${lg};
  justify-content: center;
`
const TransactionFeesWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${sm} ${lg};
`

type OwnProps = {
  isOpen: boolean
  app: SafeApp
  txs: Transaction[]
  params?: TransactionParams
  safeAddress: string
  safeName: string
  ethBalance: string
  onUserConfirm: (safeTxHash: string) => void
  onTxReject: () => void
  onClose: () => void
}

const { nativeCoin } = getNetworkInfo()

const parseTxValue = (value: string | number): string => {
  return web3ReadOnly.utils.toBN(value).toString()
}

export const ConfirmTransactionModal = ({
  isOpen,
  app,
  txs,
  safeAddress,
  ethBalance,
  safeName,
  params,
  onUserConfirm,
  onClose,
  onTxReject,
}: OwnProps): React.ReactElement | null => {
  const [estimatedSafeTxGas, setEstimatedSafeTxGas] = useState(0)
  const threshold = useSelector(safeThresholdSelector) || 1

  const txRecipient: string | undefined = useMemo(() => (txs.length > 1 ? MULTI_SEND_ADDRESS : txs[0]?.to), [txs])
  const txData: string | undefined = useMemo(() => (txs.length > 1 ? encodeMultiSendCall(txs) : txs[0]?.data), [txs])
  const txValue: string | undefined = useMemo(
    () => (txs.length > 1 ? '0' : txs[0]?.value && parseTxValue(txs[0]?.value)),
    [txs],
  )
  const operation = useMemo(() => (txs.length > 1 ? DELEGATE_CALL : CALL), [txs])
  const [manualSafeTxGas, setManualSafeTxGas] = useState(0)
  const [manualGasPrice, setManualGasPrice] = useState<string | undefined>()

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
  })

  useEffect(() => {
    if (params?.safeTxGas) {
      setEstimatedSafeTxGas(gasEstimation)
    }
  }, [params, gasEstimation])

  const dispatch = useDispatch()
  if (!isOpen) {
    return null
  }

  const handleTxRejection = () => {
    onTxReject()
    onClose()
  }

  const handleUserConfirmation = (safeTxHash: string): void => {
    onUserConfirm(safeTxHash)
    onClose()
  }

  const getParametersStatus = () => (threshold > 1 ? 'ETH_DISABLED' : 'ENABLED')

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

    if (newSafeTxGas && oldSafeTxGas !== newSafeTxGas) {
      setManualSafeTxGas(newSafeTxGas)
    }
  }

  const areTxsMalformed = txs.some((t) => !isTxValid(t))

  const body = areTxsMalformed
    ? () => (
        <>
          <IconText>
            <Icon color="error" size="md" type="info" />
            <Title size="xs">Transaction error</Title>
          </IconText>
          <Text size="lg">
            This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of
            this Safe App for more information.
          </Text>
        </>
      )
    : (txParameters, toggleEditMode) => {
        return (
          <>
            <Container>
              <AddressInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
              <DividerLine withArrow />
              {txs.map((tx, index) => (
                <Wrapper key={index}>
                  <Collapse description={<AddressInfo safeAddress={tx.to} />} title={`Transaction ${index + 1}`}>
                    <CollapseContent>
                      <div className="section">
                        <Heading tag="h3">Value</Heading>
                        <div className="value-section">
                          <Img alt="Ether" height={40} src={getEthAsToken('0').logoUri} />
                          <Bold>
                            {fromTokenUnit(tx.value, nativeCoin.decimals)} {nativeCoin.name}
                          </Bold>
                        </div>
                      </div>
                      <div className="section">
                        <Heading tag="h3">Data (hex encoded)*</Heading>
                        <StyledTextBox>{tx.data}</StyledTextBox>
                      </div>
                    </CollapseContent>
                  </Collapse>
                </Wrapper>
              ))}
              <DividerLine withArrow={false} />
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
                parametersStatus={getParametersStatus()}
                isTransactionCreation={isCreation}
                isTransactionExecution={isExecution}
              />
            </Container>
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
          </>
        )
      }

  return (
    <Modal description="Safe App transaction" title="Safe App transaction" open>
      <EditableTxParameters
        ethGasLimit={gasLimit}
        ethGasPrice={gasPriceFormatted}
        safeTxGas={gasEstimation.toString()}
        parametersStatus={getParametersStatus()}
        closeEditModalCallback={closeEditModalCallback}
      >
        {(txParameters, toggleEditMode) => (
          <>
            <ModalTitle title={app.name} iconUrl={app.iconUrl} onClose={handleTxRejection} />

            <Hairline />

            {body(txParameters, toggleEditMode)}

            <ModalFooter align="center" grow>
              <ModalFooterConfirmation
                cancelText="Cancel"
                handleCancel={handleTxRejection}
                handleOk={() => confirmTransactions(txParameters)}
                okDisabled={areTxsMalformed}
                okText="Submit"
              />
            </ModalFooter>
          </>
        )}
      </EditableTxParameters>
    </Modal>
  )
}
