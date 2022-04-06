import { ReactElement, useState } from 'react'
import { Loader, Title } from '@gnosis.pm/safe-react-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import styled from 'styled-components'

import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { Centered, NoTransactions } from './styled'
import { HistoryTxList } from './HistoryTxList'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'
import Button from 'src/components/layout/Button'
import HistoryFilter from './HistoryFilter'
import filterIcon from './assets/filter-icon.svg'

import { md, sm, primary300, primary200 } from 'src/theme/variables'

export const HistoryTransactions = (): ReactElement => {
  const { count, hasMore, next, transactions, isLoading } = usePagedHistoryTransactions()
  const [showFilter, setShowFilter] = useState<boolean>(true)

  const onClickFilter = () => {
    setShowFilter((prevShowFilter) => !prevShowFilter)
  }

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  if (count === 0 || !transactions.length) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">History transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <>
      <StyledFilterButton onClick={onClickFilter} variant="contained" color="primary" disableElevation>
        <StyledFilterIconImage src={filterIcon} /> Filters{' '}
        {showFilter ? <ExpandLessIcon color="secondary" /> : <ExpandMoreIcon color="secondary" />}
      </StyledFilterButton>
      {showFilter && <HistoryFilter />}
      <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
        <HistoryTxList transactions={transactions} />
      </TxsInfiniteScroll>
    </>
  )
}

const StyledFilterButton = styled(Button)`
  &.MuiButton-root {
    align-items: center;
    background-color: ${primary200};
    border: 2px solid ${primary300};
    color: #162d45;
    align-self: flex-end;
    margin-right: ${md};
    margin-top: -51px;
    margin-bottom: ${md};
    &:hover {
      background-color: ${primary200};
    }
  }
`

const StyledFilterIconImage = styled.img`
  margin-right: ${sm};
`
