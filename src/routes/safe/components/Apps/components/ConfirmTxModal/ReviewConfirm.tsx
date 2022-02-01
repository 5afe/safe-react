import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toBN } from 'web3-utils'

import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { lg, md } from 'src/theme/variables'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { BasicTxInfo, DecodeTxs } from 'src/components/DecodeTxs'
import { fetchTxDecoder } from 'src/utils/decodeTx'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Divider from 'src/components/Divider'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

import { ConfirmTxModalProps, DecodedTxDetailType } from '.'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg} 0;
`

const DecodeTxsWrapper = styled.div`
  margin: 0;
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
  onUserConfirm,
  onClose,
  onReject,
  requestId,
}: Props): ReactElement => {
  const isMultiSend = txs.length > 1
  const [decodedData, setDecodedData] = useState<DecodedTxDetailType>()
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

  // Decode tx data.
  useEffect(() => {
    let isCurrent = true
    const decodeTxData = async () => {
      const res = await fetchTxDecoder(txData)
      if (res && isCurrent) {
        setDecodedData(res)
      }
    }

    decodeTxData()
    return () => {
      isCurrent = false
    }
  }, [txData])

  const handleUserConfirmation = (safeTxHash: string): void => {
    onUserConfirm(safeTxHash, requestId)
    onClose()
  }

  const confirmTransactions = (txParameters: TxParameters, delayExecution: boolean) => {
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
          delayExecution,
        },
        handleUserConfirmation,
        onReject,
      ),
    )
  }

  return (
    <TxModalWrapper
      txTo={txRecipient}
      txData={txData}
      txValue={txValue}
      operation={operation}
      onSubmit={confirmTransactions}
      isSubmitDisabled={!isOwner}
      onBack={onReject}
    >
      <div>
        <ModalHeader title={app.name} iconUrl={app.iconUrl} onClose={onReject} />

        <Hairline />

        <Container>
          {/* Safe */}
          <Row margin="xs">
            <Paragraph color="disabled" noMargin size="lg">
              Sending from
            </Paragraph>
          </Row>
          <PrefixedEthHashInfo
            name={safeName}
            hash={safeAddress}
            strongName
            showAvatar
            showCopyBtn
            explorerUrl={explorerUrl}
          />
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

          {txs.length > 0 && (
            <DecodeTxsWrapper>
              <DecodeTxs txs={txs} decodedData={decodedData} />
            </DecodeTxsWrapper>
          )}
        </Container>
      </div>
    </TxModalWrapper>
  )
}
