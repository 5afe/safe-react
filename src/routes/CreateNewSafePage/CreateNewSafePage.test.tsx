import { fireEvent, getByText, render, screen, waitFor, waitForElementToBeRemoved } from 'src/utils/test-utils'

import CreateNewSafePage from './CreateNewSafePage'

describe('<CreateNewSafePage>', () => {
  beforeEach(() => {
    // clear the SAFE_PENDING_CREATION_STORAGE_KEY ???
  })

  it('renders CreateNewSafePage Form', async () => {
    render(<CreateNewSafePage />)

    // we show a loader
    expect(screen.getByTestId('create-new-safe-loader')).toBeInTheDocument()

    // after that we show the form
    await waitForElementToBeRemoved(() => screen.getByTestId('create-new-safe-loader'))
    await waitFor(() => expect(screen.getByTestId('create-new-safe-form')).toBeInTheDocument())
  })

  describe('Step 1: Connect wallet & select network', () => {
    it('Shows Connect Wallet Button if No wallet is connected', async () => {
      render(<CreateNewSafePage />)

      await waitForElementToBeRemoved(() => screen.getByTestId('create-new-safe-loader'))

      await waitFor(() => expect(screen.getByTestId('heading-connect-btn')).toBeInTheDocument())
    })

    it('Shows Switch Network Button and current connected network label', async () => {
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

      render(<CreateNewSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
    })

    it('Shows Switch Network Popup with all networks', async () => {
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

      render(<CreateNewSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      fireEvent.click(screen.getByTestId('switch-network-link'))

      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Mainnet')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'xDai')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'EWC')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Volta')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Polygon')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'BSC')).toBeInTheDocument()
    })

    it('Shows the Switch Network popup if clicks on the current selected Network label', async () => {
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

      render(<CreateNewSafePage />, customState)

      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Rinkeby'))
      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Mainnet')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'xDai')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'EWC')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Volta')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Polygon')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'BSC')).toBeInTheDocument()
    })

    it('Shows Switch Network Popup and can switch the network', async () => {
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

      render(<CreateNewSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      // from Rinkeby to Mainnet
      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Switch Network'))
      fireEvent.click(screen.getByText('Mainnet'))
      await waitFor(() => expect(screen.getByText('Mainnet')).toBeInTheDocument())

      // from Mainnet to Polygon
      fireEvent.click(screen.getByText('Switch Network'))
      fireEvent.click(screen.getByText('Polygon'))
      await waitFor(() => expect(screen.getByText('Polygon')).toBeInTheDocument())

      // from Polygon to Rinkeby
      fireEvent.click(screen.getByText('Switch Network'))
      fireEvent.click(screen.getByText('Rinkeby'))
      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())
    })

    it('Closes the Switch Network popup', async () => {
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

      render(<CreateNewSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Switch Network'))

      // closes popup
      fireEvent.click(screen.getByLabelText('close'))
      await waitForElementToBeRemoved(() => screen.getByTestId('select-network-popup'))

      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())
    })
  })
})
