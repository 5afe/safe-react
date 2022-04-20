import { ReactElement } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'
import { TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import { Link } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import styled from 'styled-components'

import { useAssetInfo } from 'src/routes/safe/components/Transactions/TxList/hooks/useAssetInfo'
import { useKnownAddress } from 'src/routes/safe/components/Transactions/TxList/hooks/useKnownAddress'
import { useTransactionType } from 'src/routes/safe/components/Transactions/TxList/hooks/useTransactionType'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { boldFont, grey400, primary200, smallFontSize } from 'src/theme/variables'
import { isMultisigExecutionInfo } from 'src/logic/safe/store/models/types/gateway.d'
import Spacer from 'src/components/Spacer'
import { CustomIconText } from 'src/components/CustomIconText'
import { TxInfo } from 'src/routes/safe/components/Transactions/TxList/TxCollapsed'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

const TransactionToConfirm = styled(Link)`
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: 36px 1fr 1fr auto;
  gap: 4px;
  margin: 0 auto;
  padding: 8px 24px;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${grey400};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  box-sizing: border-box;
`

const StyledConfirmationsCount = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${primary200};
  font-weight: ${boldFont};
  font-size: ${smallFontSize};
`

const TxConfirmations = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  & svg {
    margin-left: 8px;
  }
`

type PendingTxType = {
  transaction: TransactionSummary
  url: string
}

const PendingTx = ({ transaction, url }: PendingTxType): ReactElement => {
  const info = useAssetInfo(transaction.txInfo)
  const type = useTransactionType(transaction)
  const toAddress = getTxTo(transaction)
  const toInfo = useKnownAddress(toAddress)

  return (
    <TransactionToConfirm key={transaction.id} to={url}>
      <Text color="text" size="lg" as="span">
        {isMultisigExecutionInfo(transaction.executionInfo) && transaction.executionInfo.nonce}
      </Text>
      <CustomIconText
        address={toAddress?.value || EMPTY_DATA}
        iconUrl={type.icon || toInfo?.logoUri || undefined}
        iconUrlFallback={type.fallbackIcon}
        text={type.text || toInfo?.name || undefined}
      />
      {info ? <TxInfo info={info} /> : <Spacer />}
      <TxConfirmations>
        {isMultisigExecutionInfo(transaction.executionInfo) ? (
          <StyledConfirmationsCount>
            {`${transaction.executionInfo.confirmationsSubmitted}/${transaction.executionInfo.confirmationsRequired}`}
          </StyledConfirmationsCount>
        ) : (
          <Spacer />
        )}
        <ChevronRightIcon color="secondary" />
      </TxConfirmations>
    </TransactionToConfirm>
  )
}

export default PendingTx
