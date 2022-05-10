import PrefixedEthHashInfo from '.'
import { render, screen } from 'src/utils/test-utils'
import { CURRENT_SESSION_REDUCER_ID } from 'src/logic/currentSession/store/reducer/currentSession'

const hash = '0x69904ff6d6100799344E5C9A2806936318F6ba4f'

describe('<PrefixedEthHashInfo>', () => {
  it('Renders PrefixedEthHashInfo without shortName', () => {
    const customState = {
      appearance: {
        showShortName: false,
      },
      [CURRENT_SESSION_REDUCER_ID]: {
        currentShortName: 'arb',
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
      [CURRENT_SESSION_REDUCER_ID]: {
        currentShortName: 'arb',
      },
    }

    render(<PrefixedEthHashInfo hash={hash} />, customState)

    expect(screen.queryByText('arb:')).toBeInTheDocument()
    expect(screen.getByText(hash)).toBeInTheDocument()
  })
})
