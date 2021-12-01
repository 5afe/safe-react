import PrefixedEthHashInfo from '.'
import { render, screen } from 'src/utils/test-utils'

const hash = '0x69904ff6d6100799344E5C9A2806936318F6ba4f'
jest.mock('src/routes/routes', () => {
  const original = jest.requireActual('src/routes/routes')
  return {
    ...original,
    extractShortChainName: () => 'arb',
  }
})

describe('<PrefixedEthHashInfo>', () => {
  it('Renders PrefixedEthHashInfo without shortName', () => {
    const customState = {
      appearance: {
        showShortName: false,
      },
    }

    render(<PrefixedEthHashInfo hash={hash} />, customState)

    expect(screen.queryByText('arb:')).not.toBeInTheDocument()
    expect(screen.getByText(hash)).toBeInTheDocument()
  })

  it('Renders PrefixedEthHashInfo with shortName', () => {
    const customState = {
      appearance: {
        showShortName: true,
      },
    }

    render(<PrefixedEthHashInfo hash={hash} />, customState)

    expect(screen.queryByText('arb:')).toBeInTheDocument()
    expect(screen.getByText(hash)).toBeInTheDocument()
  })
})
