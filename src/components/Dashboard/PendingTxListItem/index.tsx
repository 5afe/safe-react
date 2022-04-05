import { ReactElement } from 'react'
import { Icon, Text } from '@gnosis.pm/safe-react-components'
import { TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import { Link } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import styled from 'styled-components'

import { useAssetInfo } from 'src/routes/safe/components/Transactions/TxList/hooks/useAssetInfo'
import { useKnownAddress } from 'src/routes/safe/components/Transactions/TxList/hooks/useKnownAddress'
import { useTransactionType } from 'src/routes/safe/components/Transactions/TxList/hooks/useTransactionType'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { grey400, primary200, sm } from 'src/theme/variables'
import { isMultisigExecutionInfo } from 'src/logic/safe/store/models/types/gateway.d'
import Spacer from 'src/components/Spacer'
import { CustomIconText } from 'src/components/CustomIconText'
import { TxInfo } from 'src/routes/safe/components/Transactions/TxList/TxCollapsed'

const TransactionToConfirm = styled(Link)`
  min-width: 270px;
  height: 40px;
  display: grid;
  align-items: center;
  grid-template-columns: 25px 3fr 2fr 1.5fr;
  gap: 4px;
  margin: ${sm} auto;
  padding: 4px 8px;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${grey400};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
`

const StyledConfirmationsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  background-color: ${primary200};
  padding: 8px 6px;
`

const TxConfirmations = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  margin-left: auto;
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
        address={toAddress?.value || '0x'}
        iconUrl={type.icon || toInfo?.logoUri || undefined}
        iconUrlFallback={type.fallbackIcon}
        text={type.text || toInfo?.name || undefined}
      />
      {info ? <TxInfo info={info} /> : <Spacer />}
      <TxConfirmations>
        {isMultisigExecutionInfo(transaction.executionInfo) ? (
          <StyledConfirmationsCount>
            <Icon type="check" size="md" color="primary" />
            {transaction.executionInfo.confirmationsSubmitted}
          </StyledConfirmationsCount>
        ) : (
          <Spacer />
        )}
        <ChevronRightIcon />
      </TxConfirmations>
    </TransactionToConfirm>
  )
}

export default PendingTx
