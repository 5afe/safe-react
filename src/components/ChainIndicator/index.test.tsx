import ChainIndicator from '.'
import { render } from 'src/utils/test-utils'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'

describe('<ChainIndicator>', () => {
  it('renders Rinkeby indicator', () => {
    const { container } = render(<ChainIndicator chainId={'4' as ETHEREUM_NETWORK} />)
    const icon = container.querySelector('svg')
    const label = (container.textContent || '').trim()

    expect(icon?.getAttribute('color')).toBe('#E8673C')
    expect(label).toBe('Rinkeby')
  })

  it('renders Polygon indicator', () => {
    const { container } = render(<ChainIndicator chainId={'137' as ETHEREUM_NETWORK} />)
    const icon = container.querySelector('svg')
    const label = (container.textContent || '').trim()

    expect(icon?.getAttribute('color')).toBe('#8B50ED')
    expect(label).toBe('Polygon')
  })
})
