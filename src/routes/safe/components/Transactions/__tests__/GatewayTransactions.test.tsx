import { screen, fireEvent } from '@testing-library/react'
import Router, { match } from 'react-router-dom'

import { render } from 'src/utils/test-utils'
import GatewayTransactions from '../TxList'
import { SAFE_ROUTES, history } from 'src/routes/routes'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: jest.fn(),
}))

describe('GatewayTransactions', () => {
  beforeEach(() => {
    jest.spyOn(Router, 'useRouteMatch').mockReturnValue({ path: SAFE_ROUTES.TRANSACTIONS_HISTORY } as match)
  })

  it('Transactions page should land on History tab', () => {
    const shortName = 'rin'
    const safeAddress = ZERO_ADDRESS

    history.push(`/${shortName}:${safeAddress}/transactions/history`)

    render(<GatewayTransactions />)

    const queueTab = screen.getByText('Queue').closest('button')
    const historyTab = screen.getByText('History').closest('button')

    expect(queueTab).toHaveAttribute('aria-selected', 'false')
    expect(historyTab).toHaveAttribute('aria-selected', 'true')
  })

  it('Should change route when clicking on another Transactions tab', () => {
    const shortName = 'rin'
    const safeAddress = ZERO_ADDRESS

    history.push(`/${shortName}:${safeAddress}/transactions/history`)

    render(<GatewayTransactions />)

    const queueTab = screen.getByText('Queue')
    fireEvent.click(queueTab)

    const expectedPath = `/${shortName}:${safeAddress}/transactions/queue`

    expect(history.location.pathname).toBe(expectedPath)
  })
})
