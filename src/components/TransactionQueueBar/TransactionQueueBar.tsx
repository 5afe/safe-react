import { ReactElement, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
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

import { black300, primary200, grey400, background } from 'src/theme/variables'
import { QueueTransactions } from 'src/routes/safe/components/Transactions/TxList/QueueTransactions'
import { usePagedQueuedTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/usePagedQueuedTransactions'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { SAFE_ROUTES } from 'src/routes/routes'

const TransactionQueueBar = (): ReactElement | null => {
  const [closed, setClosed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const onClickQueueBar = () => {
    setExpanded((expanded) => !expanded)
  }

  const onCloseQueueBar = () => {
    setClosed(true)
    setExpanded(false)
  }

  const { transactions } = usePagedQueuedTransactions()

  const queuedTxCount = transactions ? transactions.next.count + transactions.queue.count : 0
  const hasPendingTransactions = queuedTxCount !== 0

  // if a new transaction is proposed, we show the transaction queue bar
  useEffect(() => {
    if (queuedTxCount) {
      setClosed(false)
    }
    setExpanded(false)
  }, [queuedTxCount])

  const isSafeAppView = !!useSafeAppUrl().getAppUrl()
  const isSafeAppRoute = !!useRouteMatch(SAFE_ROUTES.APPS) && isSafeAppView

  const showQueueBar = isSafeAppRoute && hasPendingTransactions && !closed

  return showQueueBar ? (
    <>
      <Wrapper expanded={expanded}>
        <ClickAwayListener onClickAway={() => setExpanded(false)} mouseEvent="onMouseDown" touchEvent="onTouchStart">
          <StyledAccordion
            data-testid="transaction-queue-bar"
            expanded={expanded}
            onChange={onClickQueueBar}
            TransitionProps={{
              timeout: {
                appear: 400,
                enter: 0,
                exit: 500,
              },
              unmountOnExit: true,
              mountOnEnter: true,
            }}
          >
            <StyledAccordionSummary data-testid="transaction-queue-bar-summary" expandIcon={<StyledExpandIcon />}>
              <Text size="xl" color="primary" strong>
                ({queuedTxCount}) Transaction Queue
              </Text>

              <StyledCloseIconButton onClick={onCloseQueueBar} aria-label="close transaction queue bar">
                <CloseIcon />
              </StyledCloseIconButton>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <QueueTransactions />
            </StyledAccordionDetails>
          </StyledAccordion>
        </ClickAwayListener>
      </Wrapper>
      <StyledBackdrop open={expanded} />
    </>
  ) : null
}

export default TransactionQueueBar

const Wrapper = styled.div<{ expanded: boolean }>`
  position: relative;
  bottom: ${({ expanded }) => (expanded ? 'calc(100vh - 375px)' : '0')};
  right: 0;
  height: 72px;
  z-index: 1;

  transition: bottom 0.35s ease-in-out 0s;
`
const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root.Mui-expanded {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`

const StyledAccordionDetails = styled(AccordionDetails)`
  background-color: ${background};
  flex-direction: column;

  > span {
    margin-top: -60px;
    margin-right: 80px;
  }

  > div#infinite-scroll-container {
    height: calc(100vh - 400px);
    margin-top: 10px;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 70px;
  border-bottom: 2px solid ${grey400};
  border-top: 1px solid ${grey400};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding-right: 72px;
  position: relative;

  &.Mui-expanded {
    border-top: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:hover {
    background-color: ${primary200};
  }
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
