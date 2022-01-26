import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { Button } from '@gnosis.pm/safe-react-components'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { currentSafe, currentSafeEthBalance } from 'src/logic/safe/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { nextTransaction } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { grantedSelector } from 'src/routes/safe/container/selector'

const TX_AMOUNT = '0.0001'

const prepareTx = async (address: string): Promise<void> => {
  const newTxBtn = screen.getByText('New transaction')
  fireEvent.click(newTxBtn)

  const sendBtn = await screen.findByText('Send funds')
  fireEvent.click(sendBtn)

  const recipientInput = await screen.findByTestId('address-book-input')
  fireEvent.change(recipientInput, { target: { value: address } })

  const tokenInput = await screen.findByTestId('token-input')
  fireEvent.change(tokenInput, { target: { value: ZERO_ADDRESS } })

  const amountInput = await screen.findByPlaceholderText('Amount*')
  fireEvent.change(amountInput, { target: { value: TX_AMOUNT } })

  const reviewBtn = await screen.findByText('Review')
  fireEvent.click(reviewBtn)

  const estimatingBtn = await screen.findByText('Estimating')
  await waitForElementToBeRemoved(estimatingBtn, { timeout: 10000 })
}

const submitTx = async (): Promise<void> => {
  const submitBtn = await screen.findByText('Submit')
  fireEvent.click(submitBtn)
}

const stopExecution = async (): Promise<void> => {
  const executionCheckbox = await screen.findByTestId('execute-checkbox')
  fireEvent.click(executionCheckbox)
}

const createQueuedTx = async (address: string, threshold = 1): Promise<void> => {
  await prepareTx(address)
  if (threshold === 1) {
    await stopExecution()
  }
  await submitTx()
}

const createExecutedTx = async (address: string): Promise<void> => {
  await prepareTx(address)
  await submitTx()
}

// const getStatusUrl = (address: string): string => {
//   return `https://rimeissner.dev/safe-status-check/#/${getShortName()}:${address}`
// }

const DevTools = (): ReactElement => {
  const { owners, threshold = 1 } = useSelector(currentSafe) ?? {}
  const safeAddress = extractSafeAddress()
  const nextTx = useSelector(nextTransaction)
  const isGranted = useSelector(grantedSelector)
  const ethBalance = useSelector(currentSafeEthBalance)

  const hasSufficientFunds = (): boolean => {
    let hasFunds = false
    try {
      hasFunds = parseFloat(ethBalance) > parseFloat(TX_AMOUNT)
    } catch (err) {}
    return hasFunds
  }

  return (
    <>
      <List dense>
        <ListItem>
          <ListItemText primary="Developer Tools" secondary={`Threshold: ${threshold} / ${owners?.length || 0}`} />
        </ListItem>
        {/* <ListItem button>
          <ListItemText onClick={() => history.push(TRANSACTIONS_QUEUE)}>Queue</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText onClick={() => history.push(TRANSACTIONS_HISTORY)}>History</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText onClick={() => window.open(getStatusUrl(safeAddress), '_blank')}>Safe Status</ListItemText>
        </ListItem> */}
      </List>
      <ButtonWrapper>
        <StyledButton
          onClick={() => createQueuedTx(safeAddress, threshold)}
          size="md"
          variant="bordered"
          disabled={!isGranted || !hasSufficientFunds()}
        >
          Queue
        </StyledButton>
        <StyledButton
          onClick={() => createExecutedTx(safeAddress)}
          size="md"
          variant="bordered"
          disabled={!isGranted || !hasSufficientFunds() || !nextTx || threshold > 1}
        >
          Execute
        </StyledButton>
      </ButtonWrapper>
    </>
  )
}

export default DevTools

const StyledButton = styled(Button)`
  &.MuiButton-root {
    padding: 0 12px !important;
    min-width: 45% !important;
  }

  & .MuiButton-label {
    font-size: 14px !important;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 12px;
`
