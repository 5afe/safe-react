import { render } from 'src/utils/test-utils'
import GatewayTransactions from '../TxList'

describe('Tx List', () => {
  it('Transactions page should land on History tab', () => {
    const { getByText } = render(<GatewayTransactions />)

    const queueTab = getByText('Queue').closest('button')
    const historyTab = getByText('History').closest('button')

    expect(queueTab).toHaveAttribute('aria-selected', 'false')
    expect(historyTab).toHaveAttribute('aria-selected', 'true')
  })
})
