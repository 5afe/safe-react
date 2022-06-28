import { ReactElement, useEffect, useState } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandLessRounded'
import CloseIcon from '@material-ui/icons/CloseRounded'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import styled from 'styled-components'
import Backdrop from '@material-ui/core/Backdrop'

import { black300 } from 'src/theme/variables'
import { TxsInfiniteScroll } from 'src/routes/safe/components/Transactions/TxList/TxsInfiniteScroll'
import { TxLocationContext } from 'src/routes/safe/components/Transactions/TxList/TxLocationProvider'
import { QueueTxList } from 'src/routes/safe/components/Transactions/TxList/QueueTxList'
import { usePagedQueuedTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/usePagedQueuedTransactions'
import { grey400, background } from 'src/theme/variables'

type QueueBarProps = {
  setClosedBar: (close: boolean) => void
}

const QueueBar = ({ setClosedBar }: QueueBarProps): ReactElement => {
  const [expanded, setExpanded] = useState(false)

  const { isLoading, next, transactions } = usePagedQueuedTransactions()

  const collapseQueueBar = () => {
    setExpanded((expanded) => !expanded)
  }

  const closeQueueBar = () => {
    setClosedBar(true)
    setExpanded(false)
  }

  const queuedTxCount = transactions ? transactions.next.count + transactions.queue.count : 0

  useEffect(() => {
    if (queuedTxCount) {
      setClosedBar(false)
      setExpanded(false)
    }
  }, [queuedTxCount, setClosedBar])

  return (
    <>
      <Wrapper expanded={expanded}>
        <ClickAwayListener onClickAway={() => setExpanded(false)} mouseEvent="onMouseDown" touchEvent="onTouchStart">
          <Accordion
            data-testid="pending-transactions-queue"
            expanded={expanded}
            onChange={collapseQueueBar}
            TransitionProps={{
              timeout: {
                appear: 400,
                enter: 0,
                exit: 500,
              },
            }}
          >
            <StyledAccordionSummary data-testid="pending-transactions-queue-summary" expandIcon={<StyledExpandIcon />}>
              <Text size="xl" color="primary" strong>
                ({queuedTxCount}) Transaction Queue
              </Text>

              <StyledCloseIconButton onClick={closeQueueBar} aria-label="close pending transactions queue">
                <CloseIcon />
              </StyledCloseIconButton>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <TxsInfiniteScroll next={next} isLoading={isLoading}>
                {/* Next list */}
                <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
                  {transactions && <QueueTxList transactions={transactions?.next.transactions} />}
                </TxLocationContext.Provider>

                {/* Queue list */}
                <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
                  {transactions && <QueueTxList transactions={transactions?.queue.transactions} />}
                </TxLocationContext.Provider>
              </TxsInfiniteScroll>
            </StyledAccordionDetails>
          </Accordion>
        </ClickAwayListener>
      </Wrapper>
      <StyledBackdrop open={expanded} />
    </>
  )
}

export default QueueBar

const Wrapper = styled.div<{ expanded: boolean }>`
  position: relative;
  bottom: ${({ expanded }) => (expanded ? 'calc(100vh - 375px)' : '0')};
  right: 0;
  height: 72px;
  z-index: 1;

  transition: bottom 0.35s ease-in-out 0s;
`

const StyledAccordionDetails = styled(AccordionDetails)`
  background-color: ${background};

  > :nth-child(1) {
    height: calc(100vh - 400px);
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 70px;
  border-bottom: 2px solid ${grey400};
  padding-right: 72px;
  position: relative;

  background-color: ${background};
`

const StyledExpandIcon = styled(ExpandMoreIcon)`
  color: ${black300};
`

const StyledCloseIconButton = styled(IconButton)`
  position: absolute;
  right: 14px;

  color: ${black300};
  margin-right: 4px;
`

const StyledBackdrop = styled(Backdrop)`
  z-index: 0;
`
