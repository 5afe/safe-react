import { ReactElement, useMemo, useState } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import styled from 'styled-components'

import { screenSm } from 'src/theme/variables'
import { TxsInfiniteScroll } from 'src/routes/safe/components/Transactions/TxList/TxsInfiniteScroll'
import { TxLocationContext } from 'src/routes/safe/components/Transactions/TxList/TxLocationProvider'
import { QueueTxList } from 'src/routes/safe/components/Transactions/TxList/QueueTxList'
import { usePagedQueuedTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/usePagedQueuedTransactions'
import { grey400, background } from 'src/theme/variables'

const QueueBar = (): ReactElement | null => {
  const [expanded, setExpanded] = useState(false)

  const collapseQueueBar = () => {
    setExpanded((expanded) => !expanded)
  }

  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()

  const queuedTxCount = useMemo(
    () => (transactions ? transactions.next.count + transactions.queue.count : 0),
    [transactions],
  )

  if (count === 0 || !transactions) {
    return null
  }

  return (
    <Wrapper expanded={expanded}>
      <ClickAwayListener onClickAway={() => setExpanded(false)} mouseEvent="onMouseDown" touchEvent="onTouchStart">
        <Accordion expanded={expanded} onChange={collapseQueueBar}>
          <StyledAccordionSummary
            id="pending-tx-queue-summary"
            aria-controls="queue-pending-tx-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Text size="xl" color="primary">
              Queue ({queuedTxCount})
            </Text>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
              {/* Next list */}
              <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
                {transactions.next.count !== 0 && <QueueTxList transactions={transactions.next.transactions} />}
              </TxLocationContext.Provider>

              {/* Queue list */}
              <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
                {transactions.queue.count !== 0 && <QueueTxList transactions={transactions.queue.transactions} />}
              </TxLocationContext.Provider>

              <div style={{ height: 120 }} />
            </TxsInfiniteScroll>
          </StyledAccordionDetails>
        </Accordion>
      </ClickAwayListener>
    </Wrapper>
  )
}

export default QueueBar

const Wrapper = styled.div<{ expanded: boolean }>`
  position: absolute;
  bottom: ${({ expanded }) => (expanded ? '70%' : '0')};
  right: 0;
  width: calc(100vw - 217px);
  height: 70px;

  transition: bottom 0.4s ease-in-out 0s;

  @media (max-width: ${screenSm}px) {
    width: 100%;
  }
`

const StyledAccordionDetails = styled(AccordionDetails)`
  background-color: ${background};
`

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 70px;
  border-bottom: 2px solid ${grey400};
`
