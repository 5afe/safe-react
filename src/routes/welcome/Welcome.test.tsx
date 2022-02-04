import { render, fireEvent, screen } from 'src/utils/test-utils'
import { LOAD_SAFE_ROUTE, OPEN_SAFE_ROUTE, ROOT_ROUTE } from '../routes'
import Welcome from './Welcome'

describe('<Welcome>', () => {
  it('Should render Welcome container', () => {
    render(<Welcome />)

    expect(screen.getByText('Welcome to Boba Multisig.')).toBeInTheDocument()
  })

  it('Create new Safe button should redirect to /open if a wallet is already selected', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: '4',
        smartContractWallet: false,
        hardwareWallet: false,
      },
    }

    expect(window.location.pathname).toBe(ROOT_ROUTE)

    render(<Welcome />, customState)

    const createNewSafeLinkNode = screen.getByText('+ Create new Safe')

    fireEvent.click(createNewSafeLinkNode)

    expect(window.location.pathname).toBe(OPEN_SAFE_ROUTE)
  })

  it('Add existing Safe button should redirect to /load if a wallet is already selected', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: '4',
        smartContractWallet: false,
        hardwareWallet: false,
      },
    }

    expect(window.location.pathname).toBe(ROOT_ROUTE)

    render(<Welcome />, customState)

    const addExistingSafeLinkNode = screen.getByRole('button', {
      name: 'Add existing Safe',
    })

    fireEvent.click(addExistingSafeLinkNode)

    expect(window.location.pathname).toBe(LOAD_SAFE_ROUTE)
  })
})
