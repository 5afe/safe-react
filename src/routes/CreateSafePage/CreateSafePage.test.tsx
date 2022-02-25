import {
  fireEvent,
  getByText,
  getByRole,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from 'src/utils/test-utils'

import CreateSafePage from './CreateSafePage'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import * as ethTransactions from 'src/logic/wallets/ethTransactions'
import * as safeContracts from 'src/logic/contracts/safeContracts'

const mockedDateValue = 1487076708000
const DateSpy = jest.spyOn(global.Date, 'now')

const estimateGasForDeployingSafeSpy = jest.spyOn(safeContracts, 'estimateGasForDeployingSafe')
const calculateGasPriceSpy = jest.spyOn(ethTransactions, 'calculateGasPrice')

const getENSAddressSpy = jest.spyOn(getWeb3ReadOnly().eth.ens, 'getAddress')
jest.spyOn(getWeb3ReadOnly().eth.ens, 'getResolver')

jest.mock('src/logic/contracts/safeContracts', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('src/logic/contracts/safeContracts')

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    instantiateSafeContracts: jest.fn(() => Promise.resolve()),
  }
})

const secondOwnerAddress = '0xfe8BEBd43Ac213bea4bb8eC9e2dd90632f9371b2'
const validENSNameDomain = 'testENSDomain.eth'
const notExistingENSNameDomain = 'notExistingENSDomain.eth'

describe('<CreateSafePage>', () => {
  it('renders CreateSafePage Form', async () => {
    render(<CreateSafePage />)

    // we show a loader
    expect(screen.getByTestId('create-safe-loader')).toBeInTheDocument()

    // after that we show the form
    await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))
    await waitFor(() => expect(screen.getByTestId('create-safe-form')).toBeInTheDocument())
  })

  describe('Step 1: Connect wallet & select network', () => {
    it('Shows Connect Wallet Button if No wallet is connected', async () => {
      render(<CreateSafePage />)

      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

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
        },
      }

      render(<CreateSafePage />, customState)

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
        },
      }

      render(<CreateSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      fireEvent.click(screen.getByTestId('switch-network-link'))

      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Ethereum')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
    })

    it('Shows the Switch Network popup if clicks on the current selected Network label', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)

      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Rinkeby'))
      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Ethereum')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
    })

    it('Shows Switch Network Popup and can switch the network', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      // from Rinkeby to Mainnet
      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Switch Network'))
      fireEvent.click(screen.getByText('Ethereum'))
      await waitFor(() => expect(screen.getByText('Ethereum')).toBeInTheDocument())

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
        },
      }

      render(<CreateSafePage />, customState)

      await waitFor(() => expect(screen.getByTestId('switch-network-link')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Switch Network'))

      // closes popup
      fireEvent.click(screen.getByLabelText('close'))
      await waitForElementToBeRemoved(() => screen.getByTestId('select-network-popup'))

      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())
    })

    it('goes to the next Name Safe step when clicks on the next button', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))

      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())
    })
  })
  describe('Step 2: Safe Name', () => {
    it('Shows Safe Name text Input and the current network', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      expect(screen.getByTestId('create-safe-name-field')).toBeInTheDocument()
      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
    })

    it('goes to the next Owners and Confirmations step when clicks on the next button', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())
    })
  })

  describe('Step 3: Owners and Confirmations', () => {
    it('Shows user Account as a default owner', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      const userAccount = customState.providers.account
      const defaultOwner = screen.getByTestId('owner-address-0') as HTMLInputElement
      expect(defaultOwner.value).toBe(userAccount)
    })

    it('Shows an error if a owner address field is empty', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      const defaultOwnerInput = screen.getByTestId('owner-address-0')

      fireEvent.change(defaultOwnerInput, { target: { value: '' } })
      fireEvent.click(screen.getByText('Continue'))

      expect(screen.getByText('Required')).toBeInTheDocument()
      expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument()
    })

    it('Adds new owners button', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // 1 owner by default
      expect(screen.getByTestId('owner-address-0')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2')).not.toBeInTheDocument()

      // we add one owner more
      fireEvent.click(screen.getByTestId('add-new-owner'))
      expect(screen.getByTestId('owner-address-0')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2')).not.toBeInTheDocument()

      // we add one owner more
      fireEvent.click(screen.getByTestId('add-new-owner'))
      expect(screen.getByTestId('owner-address-0')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2')).toBeInTheDocument()
    })

    it('Removes owners button', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // no remove button should be present
      expect(screen.queryByTestId('owner-address-0-remove-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1-remove-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2-remove-button')).not.toBeInTheDocument()

      // we add 2 owners more
      fireEvent.click(screen.getByTestId('add-new-owner'))
      fireEvent.click(screen.getByTestId('add-new-owner'))

      // remove button should be present, except for the first owner field (first owner can not be removed)
      expect(screen.queryByTestId('owner-address-0-remove-button')).not.toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1-remove-button')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2-remove-button')).toBeInTheDocument()

      // we remove a owner
      expect(screen.queryByTestId('owner-address-0')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('owner-address-2-remove-button'))

      expect(screen.queryByTestId('owner-address-0')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-1')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-address-2')).not.toBeInTheDocument()
    })

    // username.eth example
    it('Gets the Owner Address From a ENS Name Domain', async () => {
      const ensDomains = {
        [validENSNameDomain]: secondOwnerAddress,
      }

      // mock getAddress to return the Owner address
      getENSAddressSpy.mockImplementation(
        (ENSNameDomain) => new Promise((resolve) => resolve(ensDomains[ENSNameDomain as string])),
      )

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      const defaultOwnerInput = screen.getByTestId('owner-address-0') as HTMLInputElement
      fireEvent.change(defaultOwnerInput, { target: { value: validENSNameDomain } })

      await waitFor(() => {
        expect(defaultOwnerInput.value).toBe(secondOwnerAddress)
        getENSAddressSpy.mockClear()
      })
    })

    it('Shows an error if it the ENS Name Domain is not registered', async () => {
      // we do not want annoying warnings in the console caused by our mock in getENSAddress
      const originalError = console.error
      console.error = (...args) => {
        if (/Code 101: Failed to resolve the address \(Given address \"notExistingENSDomain.eth\" /.test(args[0])) {
          return
        }
        originalError.call(console, ...args)
      }

      // mock getAddress fn to simulate a non existing ENS domain (rejecting the promise)
      getENSAddressSpy.mockImplementation(
        (notExistingENSNameDomain) => new Promise((reject) => reject(notExistingENSNameDomain)),
      )

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)

      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      const defaultOwnerInput = screen.getByTestId('owner-address-0')
      fireEvent.change(defaultOwnerInput, { target: { value: notExistingENSNameDomain } })

      const errorTextNode = screen.getByText('Must be a valid address, ENS or Unstoppable domain')

      expect(errorTextNode).toBeInTheDocument()
      getENSAddressSpy.mockClear()
    })

    it('Shows an error if a owner address is already introduced', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // we add one owner more
      fireEvent.click(screen.getByTestId('add-new-owner'))

      // we introduce the same address
      const defaultOwnerInput = screen.getByTestId('owner-address-1')
      fireEvent.change(defaultOwnerInput, { target: { value: '0x680cde08860141F9D223cE4E620B10Cd6741037E' } })

      const errorText = 'Address already added'

      expect(screen.getByText(errorText)).toBeInTheDocument()
    })

    it('Confirmation updates', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      expect(screen.getByText('out of 1 owner(s)')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('add-new-owner'))
      expect(screen.getByText('out of 2 owner(s)')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('add-new-owner'))
      expect(screen.getByText('out of 3 owner(s)')).toBeInTheDocument()

      const thresholdSelector = screen.getByTestId('threshold-selector-input')

      fireEvent.mouseDown(getByRole(thresholdSelector, 'button'))

      expect(screen.getByTestId('threshold-selector-option-1')).toBeInTheDocument()
      expect(screen.getByTestId('threshold-selector-option-2')).toBeInTheDocument()
      expect(screen.getByTestId('threshold-selector-option-3')).toBeInTheDocument()

      expect(getByText(thresholdSelector, '1')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('threshold-selector-option-3'))

      expect(getByText(thresholdSelector, '3')).toBeInTheDocument()
    })

    // See https://github.com/gnosis/safe-react/issues/2733
    it('You can NOT set more confirmations than owners', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // we add 3 owners
      fireEvent.click(screen.getByTestId('add-new-owner'))
      fireEvent.click(screen.getByTestId('add-new-owner'))

      const thresholdSelector = screen.getByTestId('threshold-selector-input')

      // 3 confirmations
      fireEvent.mouseDown(getByRole(thresholdSelector, 'button'))
      fireEvent.click(screen.getByTestId('threshold-selector-option-3'))

      expect(getByText(thresholdSelector, '3')).toBeInTheDocument()

      // we remove 1 owner
      fireEvent.click(screen.getByTestId('owner-address-2-remove-button'))
      expect(getByText(thresholdSelector, '2')).toBeInTheDocument()

      // we remove another owner
      fireEvent.click(screen.getByTestId('owner-address-1-remove-button'))
      expect(getByText(thresholdSelector, '1')).toBeInTheDocument()
    })
  })
  describe('Step 4: Review', () => {
    beforeEach(() => {
      estimateGasForDeployingSafeSpy.mockImplementation(() => Promise.resolve(523170))
      calculateGasPriceSpy.mockImplementation(() => Promise.resolve('44000000000'))
      DateSpy.mockImplementation(() => mockedDateValue)
    })

    it('Basic Safe information', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      const safeNameInput = screen.getByTestId('create-safe-name-field') as HTMLInputElement

      const suggestedSafeName = safeNameInput.placeholder

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      expect(calculateGasPriceSpy).not.toHaveBeenCalled()
      expect(estimateGasForDeployingSafeSpy).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-review-step')).toBeInTheDocument())

      // suggested name of the safe
      const reviewSafeNameNode = screen.getByTestId('create-safe-review-safe-name')
      expect(getByText(reviewSafeNameNode, suggestedSafeName))

      // threshold
      const reviewSafeThresholdNode = screen.getByTestId('create-safe-review-threshold-label')
      expect(getByText(reviewSafeThresholdNode, '1 out of 1 owners'))

      // number of owners label
      expect(screen.getByText('1 Safe owners'))

      // owner address
      expect(screen.getByText('0x680cde08860141F9D223cE4E620B10Cd6741037E'))

      // network label
      expect(screen.getByText('Rinkeby'))

      expect(calculateGasPriceSpy).toHaveBeenCalled()
      const userAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const addresses = [userAccount]
      const owners = addresses.length
      expect(estimateGasForDeployingSafeSpy).toHaveBeenCalledWith(addresses, owners, userAccount, mockedDateValue)

      await waitFor(() =>
        expect(screen.getByText('The creation will cost approximately 0.02302 ETH', { exact: false })),
      )
    })

    it('shows more than one owner', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // we add another owner
      fireEvent.click(screen.getByTestId('add-new-owner'))
      fireEvent.change(screen.getByTestId('owner-address-1'), { target: { value: secondOwnerAddress } })

      expect(calculateGasPriceSpy).not.toHaveBeenCalled()
      expect(estimateGasForDeployingSafeSpy).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-review-step')).toBeInTheDocument())

      // threshold
      const reviewSafeThresholdNode = screen.getByTestId('create-safe-review-threshold-label')
      expect(getByText(reviewSafeThresholdNode, '1 out of 2 owners'))

      // number of owners label
      expect(screen.getByText('2 Safe owners'))

      // owner address
      expect(screen.getByText('0x680cde08860141F9D223cE4E620B10Cd6741037E'))
      expect(screen.getByText(secondOwnerAddress))

      // network label
      expect(screen.getByText('Rinkeby'))

      expect(calculateGasPriceSpy).toHaveBeenCalled()
      const userAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const addresses = [userAccount, secondOwnerAddress]
      const owners = addresses.length
      expect(estimateGasForDeployingSafeSpy).toHaveBeenCalledWith(addresses, owners, userAccount, mockedDateValue)

      await waitFor(() =>
        expect(screen.getByText('The creation will cost approximately 0.02302 ETH', { exact: false })),
      )
    })

    it('shows custom safe name', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      const safeNameInput = screen.getByTestId('create-safe-name-field') as HTMLInputElement

      // we set a custom safe name
      const customSafeName = 'Custom Safe name'
      fireEvent.change(safeNameInput, { target: { value: customSafeName } })

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      expect(calculateGasPriceSpy).not.toHaveBeenCalled()
      expect(estimateGasForDeployingSafeSpy).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-review-step')).toBeInTheDocument())

      // suggested name of the safe
      const reviewSafeNameNode = screen.getByTestId('create-safe-review-safe-name')
      expect(getByText(reviewSafeNameNode, customSafeName))

      // threshold
      const reviewSafeThresholdNode = screen.getByTestId('create-safe-review-threshold-label')
      expect(getByText(reviewSafeThresholdNode, '1 out of 1 owners'))

      // number of owners label
      expect(screen.getByText('1 Safe owners'))

      // owner address
      expect(screen.getByText('0x680cde08860141F9D223cE4E620B10Cd6741037E'))

      // network label
      expect(screen.getByText('Rinkeby'))

      expect(calculateGasPriceSpy).toHaveBeenCalled()
      const userAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const addresses = [userAccount]
      const owners = addresses.length
      expect(estimateGasForDeployingSafeSpy).toHaveBeenCalledWith(addresses, owners, userAccount, mockedDateValue)

      await waitFor(() =>
        expect(screen.getByText('The creation will cost approximately 0.02302 ETH', { exact: false })),
      )
    })

    it('shows custom threshold', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }

      render(<CreateSafePage />, customState)
      await waitForElementToBeRemoved(() => screen.getByTestId('create-safe-loader'))

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-name-step')).toBeInTheDocument())

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-owners-confirmation-step')).toBeInTheDocument())

      // we add another owner
      fireEvent.click(screen.getByTestId('add-new-owner'))
      fireEvent.change(screen.getByTestId('owner-address-1'), { target: { value: secondOwnerAddress } })

      // we set 2 confirmations
      const thresholdSelector = screen.getByTestId('threshold-selector-input')
      fireEvent.mouseDown(getByRole(thresholdSelector, 'button'))
      fireEvent.click(screen.getByTestId('threshold-selector-option-2'))

      expect(calculateGasPriceSpy).not.toHaveBeenCalled()
      expect(estimateGasForDeployingSafeSpy).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('Continue'))
      await waitFor(() => expect(screen.getByTestId('create-safe-review-step')).toBeInTheDocument())

      // threshold
      const reviewSafeThresholdNode = screen.getByTestId('create-safe-review-threshold-label')
      expect(getByText(reviewSafeThresholdNode, '2 out of 2 owners'))

      // number of owners label
      expect(screen.getByText('2 Safe owners'))

      // owner address
      expect(screen.getByText('0x680cde08860141F9D223cE4E620B10Cd6741037E'))
      expect(screen.getByText(secondOwnerAddress))

      // network label
      expect(screen.getByText('Rinkeby'))

      expect(calculateGasPriceSpy).toHaveBeenCalled()
      const userAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const addresses = [userAccount, secondOwnerAddress]
      const owners = addresses.length
      expect(estimateGasForDeployingSafeSpy).toHaveBeenCalledWith(addresses, owners, userAccount, mockedDateValue)

      await waitFor(() =>
        expect(screen.getByText('The creation will cost approximately 0.02302 ETH', { exact: false })),
      )
    })
  })
})
