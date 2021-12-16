import { ChainId } from 'src/config/chain.d'
import { render } from 'src/utils/test-utils'
import ChainIndicator from '.'

describe('<ChainIndicator>', () => {
  it('renders Rinkeby indicator', () => {
    const { container } = render(<ChainIndicator chainId={'4' as ChainId} />)
    const icon = container.querySelector('svg')
    const label = (container.textContent || '').trim()

    expect(icon?.getAttribute('color')).toBe('#E8673C')
    expect(label).toBe('Rinkeby')
  })

  it('renders Polygon indicator', () => {
    const { container } = render(<ChainIndicator chainId={'137' as ChainId} />)
    const icon = container.querySelector('svg')
    const label = (container.textContent || '').trim()

    expect(icon?.getAttribute('color')).toBe('#8248E5')
    expect(label).toBe('Polygon')
  })
})
