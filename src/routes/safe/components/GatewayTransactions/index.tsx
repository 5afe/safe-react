import { Accordion, EthHashInfo, Loader, Menu, Tab, Text } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { format } from 'date-fns'
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExplorerInfo } from 'src/config'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'

import {
  Creation,
  ExpandedTxDetails,
  isCreationTxInfo,
  isCustomTxInfo,
  isModuleExecutionDetails,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  Operation,
  SettingsChange,
  Transaction,
  Transfer,
} from 'src/logic/safe/store/models/types/gateway.d'
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { useAssetInfo } from 'src/routes/safe/components/GatewayTransactions/Collapsed/hooks/useAssetInfo'
import { fetchTransactionDetails } from 'src/routes/safe/components/GatewayTransactions/Expanded/actions/fetchTransactionDetails'
import { getTransactionDetails } from 'src/routes/safe/components/GatewayTransactions/Expanded/selectors/getTransactionDetails'
import { NOT_AVAILABLE } from 'src/routes/safe/components/GatewayTransactions/utils'
import { TxData as LegacyTxData } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/CustomDescription'
import styled from 'styled-components'
import { TokenTransferAmount } from './Collapsed/TokenTransferAmount'
import { TxType } from './TxType'

import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import Img from 'src/components/layout/Img'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Breadcrumb = styled.div`
  height: 51px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`

const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

const StyledTransactionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 16px 0;
`

const StyledTransactions = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: #00000026 0 0 8px 2px;
  overflow: hidden;
  width: 100%;

  & .MuiAccordion-root {
    &:first-child {
      border-top: none;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  & .MuiAccordionSummary-root {
    &.Mui-expanded {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`

const StyledTransaction = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 1fr 2fr 2fr 2fr;
  width: 100%;

  & > div {
    align-self: center;
  }

  & .tx-status {
    justify-self: end;
    margin-right: 8px;
  }
`

const formatDateTime = (timestamp: number): string => {
  return format(timestamp, 'MMM d, yyyy - h:mm:ss a')
}

type QueueTxListProps = {
  title: string
  transactions: TransactionDetails['transactions']
}

const QueueTxList = ({ title, transactions }: QueueTxListProps): ReactElement => (
  <>
    <H2>{title}</H2>
    {transactions.map(([nonce, txs]) => (
      <React.Fragment key={nonce}>
        {txs.length === 1 ? (
          <div>{JSON.stringify(txs[0])}</div>
        ) : (
          txs.map((transaction) => <div key={transaction.id}>{JSON.stringify(transaction)}</div>)
        )}
      </React.Fragment>
    ))}
  </>
)

type TransactionDetails = {
  count: number
  transactions: Array<[nonce: string, transactions: Transaction[]]>
}

type QueueTransactionsInfo = {
  next: TransactionDetails
  queue: TransactionDetails
}

const useQueueTransactions = (): QueueTransactionsInfo => {
  const nextTxs = useSelector(nextTransactions)
  const queuedTxs = useSelector(queuedTransactions)
  const [txsCount, setTxsCount] = useState({ next: 0, queued: 0 })

  useEffect(() => {
    const next = nextTxs
      ? Object.entries(nextTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    const queued = queuedTxs
      ? Object.entries(queuedTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    setTxsCount({ next, queued })
  }, [nextTxs, queuedTxs])

  return {
    next: {
      count: txsCount.next,
      transactions: nextTxs ? Object.entries(nextTxs) : [],
    },
    queue: {
      count: txsCount.queued,
      transactions: queuedTxs ? Object.entries(queuedTxs) : [],
    },
  }
}

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()

  return next.count + queue.count === 0 ? (
    <div>No txs</div>
  ) : (
    <>
      {next.transactions && <QueueTxList title="Next Transaction" transactions={next.transactions} />}
      {queue.transactions && <QueueTxList title="Queue" transactions={queue.transactions} />}
    </>
  )
}

const useTransactionDetails = (
  transactionId: string,
  txLocation: 'history' | 'queued.next' | 'queued.queued',
): { data?: ExpandedTxDetails; loading: boolean } => {
  const dispatch = useRef(useDispatch())
  const [txDetails, setTxDetails] = useState<{ data?: ExpandedTxDetails; loading: boolean }>({
    loading: true,
    data: undefined,
  })
  const data = useSelector((state) => getTransactionDetails(state, transactionId, txLocation))

  useEffect(() => {
    if (data) {
      setTxDetails({ loading: false, data })
    } else {
      // lookup tx details
      dispatch.current(fetchTransactionDetails({ transactionId, txLocation }))
    }
  }, [data, transactionId, txLocation])

  return txDetails
}

const TxDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2px;
  row-gap: 2px;
  background-color: lightgray;
  width: 100%;
  min-height: 115px;

  & > div {
    overflow: hidden;
    background-color: white;
    line-break: anywhere;
    padding: 8px 16px;
    word-break: break-all;
  }

  .tx-summary {
    grid-row-start: 1;
    grid-row-end: row1-end;
  }

  .tx-data {
    grid-row-start: 2;
  }

  .tx-owners {
    grid-column-start: 2;
    grid-row-start: 1;
    grid-row-end: span 2;
  }
`
const OwnerList = styled.ul`
  list-style: none;
  margin: 1em;
  width: 50%;

  .legend {
    padding: 0 1.5em 1.5em 1.5em;
    position: relative;

    .owner-info {
      margin: 5px;
    }

    span {
      color: #008c73;
      font-weight: bold;
    }
  }

  .icon {
    position: absolute;
    width: 16px;
    z-index: 2;
    left: -7px;
  }
`
const OwnerListItem = styled.li`
  display: flex;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    height: 100%;
    border-left: 2px #919191 solid;
  }

  &:last-child::before {
    border-left: none;
  }
`

const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
`

const TxSummary = ({
  txDetails: { txHash, detailedExecutionInfo, executedAt, txData },
}: {
  txDetails: ExpandedTxDetails
}): ReactElement => {
  const explorerUrl = txHash ? getExplorerInfo(txHash) : null
  const nonce = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.nonce : undefined
  const created = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.submittedAt : undefined

  return (
    <>
      <div className="tx-hash">
        <Text size="md" strong as="span">
          Hash:
        </Text>{' '}
        {txHash ? (
          <InlineEthHashInfo hash={txHash} shortenHash={8} showCopyBtn explorerUrl={explorerUrl} />
        ) : (
          NOT_AVAILABLE
        )}
      </div>
      {nonce && (
        <div className="tx-nonce">
          <Text size="md" strong as="span">
            Nonce:
          </Text>{' '}
          {nonce}
        </div>
      )}
      {created && (
        <div className="tx-created">
          <Text size="md" strong as="span">
            Created:
          </Text>{' '}
          {formatDateTime(created)}
        </div>
      )}
      <div className="tx-executed">
        <Text size="md" strong as="span">
          Executed:
        </Text>{' '}
        {executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE}
      </div>
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <Text size="md" strong as="span">
            Delegate Call
          </Text>
        </div>
      )}
    </>
  )
}

const InfoDetails = ({ children, title }: { children: ReactNode; title: string }): ReactElement => {
  return (
    <>
      <Text size="md" strong>
        {title}
      </Text>
      {children}
    </>
  )
}

const AddressInfo = ({ address }: { address: string }): ReactElement => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))
  const explorerUrl = getExplorerInfo(address)

  return (
    <EthHashInfo
      hash={address}
      name={recipientName === 'UNKNOWN' ? undefined : recipientName}
      showIdenticon
      showCopyBtn
      explorerUrl={explorerUrl}
    />
  )
}

const TxInfoDetails = ({
  title,
  address,
}: {
  title: string
  address: string
  addressActions?: any[]
}): ReactElement => (
  <InfoDetails title={title}>
    <AddressInfo address={address} />
  </InfoDetails>
)

const TxInfoTransfer = ({ txInfo }: { txInfo: Transfer }): ReactElement | null => {
  const assetInfo = useAssetInfo(txInfo)

  const title =
    txInfo.direction === 'INCOMING'
      ? `Received ${assetInfo.amountWithSymbol} from:`
      : `Send ${assetInfo.amountWithSymbol} to:`

  return <TxInfoDetails title={title} address={txInfo.sender} />
}

const TxInfoSettings = ({ settingsInfo }: { settingsInfo: SettingsChange['settingsInfo'] }): ReactElement | null => {
  if (!settingsInfo) {
    return null
  }

  switch (settingsInfo.type) {
    case 'SET_FALLBACK_HANDLER': {
      return <InfoDetails title="Set fallback handler:">{settingsInfo.handler}</InfoDetails>
    }
    case 'ADD_OWNER': {
      return (
        <InfoDetails title="Add owner:">
          <AddressInfo address={settingsInfo.owner} />
          <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    case 'REMOVE_OWNER': {
      return (
        <InfoDetails title="Remove owner:">
          <AddressInfo address={settingsInfo.owner} />
          <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    case 'SWAP_OWNER': {
      return (
        <InfoDetails title="Swap owner:">
          <TxInfoDetails title="Old owner" address={settingsInfo.oldOwner} />
          <TxInfoDetails title="New owner" address={settingsInfo.newOwner} />
        </InfoDetails>
      )
    }
    case 'CHANGE_THRESHOLD': {
      return <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
    }
    case 'CHANGE_IMPLEMENTATION': {
      return (
        <InfoDetails title="Change implementation:">
          <Text size="md" strong>
            {settingsInfo.implementation}
          </Text>
        </InfoDetails>
      )
    }
    case 'ENABLE_MODULE': {
      return (
        <InfoDetails title="Enable module:">
          <AddressInfo address={settingsInfo.module} />
        </InfoDetails>
      )
    }
    case 'DISABLE_MODULE': {
      return (
        <InfoDetails title="Disable module:">
          <AddressInfo address={settingsInfo.module} />
        </InfoDetails>
      )
    }
    default:
      return null
  }
}

const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement | null => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  return (
    <TxDetailsContainer>
      <div className="tx-summary">
        <div className="tx-hash">
          <Text size="md" strong as="span">
            Hash:
          </Text>{' '}
          <InlineEthHashInfo
            hash={txInfo.transactionHash}
            shortenHash={8}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.transactionHash)}
          />
        </div>
        <div className="tx-created">
          <Text size="md" strong as="span">
            Created:
          </Text>{' '}
          {formatDateTime(timestamp)}
        </div>
        <div className="tx-creator">
          <Text size="md" strong as="span">
            Creator:
          </Text>{' '}
          <InlineEthHashInfo
            hash={txInfo.creator}
            shortenHash={4}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.creator)}
          />
        </div>
        <div className="tx-factory">
          <Text size="md" strong as="span">
            Factory:
          </Text>{' '}
          {txInfo.factory ? (
            <InlineEthHashInfo
              hash={txInfo.factory}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.factory)}
            />
          ) : (
            NOT_AVAILABLE
          )}
        </div>
        <div className="tx-mastercopy">
          <Text size="md" strong as="span">
            Mastercopy:
          </Text>{' '}
          {txInfo.implementation ? (
            <InlineEthHashInfo
              hash={txInfo.implementation}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.implementation)}
            />
          ) : (
            NOT_AVAILABLE
          )}
        </div>
      </div>
      <div />
    </TxDetailsContainer>
  )
}

type TxInfoProps = {
  txInfo: ExpandedTxDetails['txInfo']
}
const TxInfo = ({ txInfo }: TxInfoProps): ReactElement | null => {
  if (isCustomTxInfo(txInfo)) {
    return null
  }

  if (isSettingsChangeTxInfo(txInfo)) {
    return <TxInfoSettings settingsInfo={txInfo.settingsInfo} />
  }

  if (isTransferTxInfo(txInfo)) {
    return <TxInfoTransfer txInfo={txInfo} />
  }

  return null
}

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
}
const TxData = ({ txData }: TxDataProps): ReactElement | null => {
  return (
    <>
      {txData?.hexData && (
        <div className="tx-hexData">
          <Text size="md" strong>
            Data (hex encoded):
          </Text>
          <LegacyTxData data={txData.hexData} />
        </div>
      )}
      <div className="tx-dataDecoded"></div>
    </>
  )
}

const OwnerRow = ({ ownerAddress }: { ownerAddress: string }) => {
  const ownerName = useSelector((state) => getNameFromAddressBookSelector(state, ownerAddress))

  return (
    <EthHashInfo
      hash={ownerAddress}
      shortenHash={4}
      showCopyBtn
      showIdenticon
      className="owner-info"
      name={ownerName}
      explorerUrl={getExplorerInfo(ownerAddress)}
    />
  )
}

const TxOwners = ({
  detailedExecutionInfo,
}: {
  detailedExecutionInfo: ExpandedTxDetails['detailedExecutionInfo']
}): ReactElement | null => {
  if (!detailedExecutionInfo || isModuleExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  return (
    <OwnerList>
      <OwnerListItem>
        <span className="icon">
          <Img alt="" src={CheckLargeFilledGreenCircle} />
        </span>
        <div className="legend">
          <span>Created</span>
        </div>
      </OwnerListItem>
      {detailedExecutionInfo.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer}>
          <span className="icon">
            <Img alt="" src={CheckLargeFilledGreenCircle} />
          </span>
          <div className="legend">
            <span>Confirmed</span>
            <OwnerRow ownerAddress={signer} />
          </div>
        </OwnerListItem>
      ))}
      <OwnerListItem>
        <span className="icon">
          <Img alt="" src={detailedExecutionInfo.executor ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle} />
        </span>
        <div className="legend">
          <span>Executed</span>
          {detailedExecutionInfo.executor && <OwnerRow ownerAddress={detailedExecutionInfo.executor} />}
        </div>
      </OwnerListItem>
    </OwnerList>
  )
}

const TxDetails = ({ transactionId }: { transactionId: string }): ReactElement => {
  const { data, loading } = useTransactionDetails(transactionId, 'history')

  if (loading) {
    return <Loader size="md" />
  }

  if (!data) {
    return (
      <TxDetailsContainer>
        <Text size="sm" strong>
          No data available
        </Text>
      </TxDetailsContainer>
    )
  }

  return (
    <TxDetailsContainer>
      <div className="tx-summary">
        <TxSummary txDetails={data} />
      </div>
      <div className="tx-data">
        <TxInfo txInfo={data.txInfo} />
        <TxData txData={data.txData} />
      </div>
      <div className="tx-owners">
        <TxOwners detailedExecutionInfo={data.detailedExecutionInfo} />
      </div>
    </TxDetailsContainer>
  )
}

const NoPaddingAccordion = styled(Accordion)`
  .MuiAccordionDetails-root {
    padding: 0;
  }
`

const TxRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  // TODO: summary and details as children
  return (
    <NoPaddingAccordion
      summaryContent={
        <StyledTransaction>
          <div className="tx-nonce">
            <Text size="lg">{transaction.executionInfo?.nonce}</Text>
          </div>
          <div className="tx-type">
            <TxType tx={transaction} />
          </div>
          <div className="tx-info">
            {isTransferTxInfo(transaction.txInfo) && <TokenTransferAmount txInfo={transaction.txInfo} />}
          </div>
          <div className="tx-time">
            <Text size="lg">{format(transaction.timestamp, 'h:mm a')}</Text>
          </div>
          <div className="tx-votes" />
          <div className="tx-actions" />
          <div className="tx-status">
            <Text size="lg" color={transaction.txStatus === 'SUCCESS' ? 'primary' : 'error'} className="col" strong>
              {transaction.txStatus === 'SUCCESS' ? 'Success' : 'Fail'}
            </Text>
          </div>
        </StyledTransaction>
      }
      detailsContent={
        isCreationTxInfo(transaction.txInfo) ? (
          <TxInfoCreation transaction={transaction} />
        ) : (
          <TxDetails transactionId={transaction.id} />
        )
      }
    />
  )
}

const HistoryTxList = (): ReactElement => {
  const transactions = useSelector(historyTransactions)

  return (
    <>
      {transactions &&
        Object.entries(transactions).map(([timestamp, txs]) => (
          <StyledTransactionsGroup key={timestamp}>
            <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
            <StyledTransactions>
              {txs.map((transaction) => (
                <TxRow key={transaction.id} transaction={transaction} />
              ))}
            </StyledTransactions>
          </StyledTransactionsGroup>
        ))}
    </>
  )
}

const GatewayTransactions = (): ReactElement => {
  const [tab, setTab] = useState(items[0].id)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb />
      </Menu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === 'queue' && <QueueTransactions />}
        {tab === 'history' && <HistoryTxList />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
