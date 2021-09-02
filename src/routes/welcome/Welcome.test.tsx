import { onboard } from 'src/components/ConnectButton'
import { render, fireEvent, screen } from 'src/utils/test-utils'
import Welcome from './container'

describe('<Welcome>', () => {
  it('Should render Welcome container', () => {
    render(<Welcome />)

    expect(screen.getByText('Welcome to Gnosis Safe.')).toBeInTheDocument()
  })

  it('Connect wallet button should not be disabled if no wallet is selected', () => {
    render(<Welcome />)

    const connectWalletButton = screen.getByTestId('connect-btn') as HTMLButtonElement

    expect(connectWalletButton.disabled).toBe(false)
  })

  xit('Should prompt user to select a wallet when clicks on Connect wallet button', () => {
    const showSelectWalletPromptSpy = jest.spyOn(onboard(), 'walletSelect')

    render(<Welcome />)

    expect(showSelectWalletPromptSpy).not.toHaveBeenCalled()

    const connectWalletButton = screen.getByTestId('connect-btn')

    expect(connectWalletButton).toBeInTheDocument()

    fireEvent.click(connectWalletButton)

    expect(showSelectWalletPromptSpy).toHaveBeenCalled()

    showSelectWalletPromptSpy.mockRestore()
  })

  it('Connect wallet button should be disabled if a wallet is already selected', () => {
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

    render(<Welcome />, customState)

    const connectWalletButton = screen.getByTestId('connect-btn') as HTMLButtonElement

    expect(connectWalletButton.disabled).toBe(true)
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

    expect(window.location.href).toBe('http://localhost/')

    render(<Welcome />, customState)

    const createNewSafeLinkNode = screen.getByText('+ Create new Safe')

    fireEvent.click(createNewSafeLinkNode)

    expect(window.location.href).toBe('http://localhost/#/open')
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

    expect(window.location.href).toBe('http://localhost/')

    render(<Welcome />, customState)

    const addExistingSafeLinkNode = screen.getByRole('button', {
      name: 'Add existing Safe',
    })

    fireEvent.click(addExistingSafeLinkNode)

    expect(window.location.href).toBe('http://localhost/#/load')
  })
})
