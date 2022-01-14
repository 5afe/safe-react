import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'

import { getHashedExplorerUrl, getShortName } from 'src/config'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { generatePrefixedAddressRoutes } from 'src/routes/routes'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

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
  fireEvent.change(amountInput, { target: { value: '0.0001' } }) // TODO: Check possible

  const reviewBtn = await screen.findByText('Review')
  fireEvent.click(reviewBtn)

  await waitForElementToBeRemoved(await screen.findByText('Estimating'), { timeout: 10000 })
}

const submitTx = async (): Promise<void> => {
  const submitBtn = await screen.findByText('Submit')
  fireEvent.click(submitBtn)
}

const stopExecution = async (): Promise<void> => {
  const executionCheckbox = await screen.findByTestId('execute-checkbox')
  fireEvent.click(executionCheckbox)
}

const createQueuedTx = async (address: string): Promise<void> => {
  await prepareTx(address)
  await stopExecution()
  await submitTx()
}

const createExecutedTx = async (address: string): Promise<void> => {
  await prepareTx(address)
  await submitTx()
}

const getStatusUrl = (address: string): string => {
  return `https://rimeissner.dev/safe-status-check/#/${getShortName()}:${address}`
}

const DevTools = () => {
  const { owners, threshold = 1, address } = useSelector(currentSafe) ?? {}

  const { TRANSACTIONS_QUEUE, TRANSACTIONS_HISTORY } = generatePrefixedAddressRoutes({
    shortName: getShortName(),
    safeAddress: address,
  })

  return (
    <>
      Threshold: {threshold} / {owners?.length || 0}
      <br />
      <Link to={TRANSACTIONS_QUEUE}>Queue</Link>
      <br />
      <Link to={TRANSACTIONS_HISTORY}>History</Link>
      <a href={getHashedExplorerUrl(address)} target="_blank" rel="noreferrer">
        Explorer
      </a>
      <a href={getStatusUrl(address)} target="_blank" rel="noreferrer">
        Safe Status
      </a>
      <br />
      <button onClick={() => createQueuedTx(address)}>Create queued tx</button>
      <br />
      <button onClick={() => createExecutedTx(address)}>Create and execute tx</button>
    </>
  )
}

export default DevTools
