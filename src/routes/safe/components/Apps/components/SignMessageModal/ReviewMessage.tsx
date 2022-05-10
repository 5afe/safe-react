import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { Icon, Text } from '@gnosis.pm/safe-react-components'
import MuiTextField from '@material-ui/core/TextField'
import { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import ModalTitle from 'src/components/ModalTitle'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { lg, md } from 'src/theme/variables'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { BasicTxInfo } from 'src/components/DecodeTxs'
import Block from 'src/components/layout/Block'
import Divider from 'src/components/Divider'
import { SignMessageModalProps } from '.'
import Hairline from 'src/components/layout/Hairline'
import { grantedSelector } from 'src/routes/safe/container/selector'
import Paragraph from 'src/components/layout/Paragraph'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg} 0;
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

const MessageTextArea = styled(MuiTextField)`
  &.MuiFormControl-root {
    padding-bottom: ${({ theme }) => theme.margin.md};
  }
`

const InfoMessage = styled(Paragraph)`
  display: flex;
  align-items: center;

  > span:first-child {
    margin-right: ${({ theme }) => theme.margin.xs};
  }
`

type Props = Omit<SignMessageModalProps, 'message' | 'isOpen'> & {
  txData: string
  txRecipient: string
  utf8Message: string
}

export const ReviewMessage = ({
  app,
  safeAddress,
  ethBalance,
  safeName,
  onUserConfirm,
  onClose,
  onTxReject,
  requestId,
  utf8Message,
  txData,
  txRecipient,
}: Props): ReactElement => {
  const dispatch = useDispatch()
  const explorerUrl = getExplorerInfo(safeAddress)
  const nativeCurrency = getNativeCurrency()
  const isOwner = useSelector(grantedSelector)

  const handleTxRejection = () => {
    onTxReject(requestId)
    onClose()
  }

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
          valueInWei: '0',
          txData,
          operation: Operation.DELEGATE,
          origin: app.id,
          navigateToTransactionsTab: false,
          txNonce: txParameters.safeNonce,
          safeTxGas: txParameters.safeTxGas,
          ethParameters: txParameters,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
          delayExecution,
        },
        handleUserConfirmation,
        handleTxRejection,
      ),
    )
  }

  return (
    <TxModalWrapper
      txData={txData}
      txTo={txRecipient}
      onSubmit={confirmTransactions}
      onClose={handleTxRejection}
      operation={Operation.DELEGATE}
      isSubmitDisabled={!isOwner}
    >
      <ModalTitle title={app.name} iconUrl={app.iconUrl} onClose={handleTxRejection} />

      <Hairline />

      <Container>
        {/* Safe */}
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

        <BasicTxInfo txRecipient={txRecipient} txData={txData} txValue="0" recipientName="SignMessageLib" />

        <Text size="lg" strong>
          Signing message:
        </Text>
        <MessageTextArea
          rows="2"
          multiline
          disabled
          fullWidth
          label="Message to sign"
          inputProps={{
            type: 'text',
            value: utf8Message,
            name: 'Message to sign',
            onChange: () => {},
            placeholder: '',
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <InfoMessage>
          <Icon size="md" type="info" color="warning" />
          Signing a message with the Gnosis Safe requires a transaction on the blockchain
        </InfoMessage>
      </Container>
    </TxModalWrapper>
  )
}
