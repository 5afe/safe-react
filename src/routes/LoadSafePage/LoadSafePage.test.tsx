import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { getShortName } from 'src/config'
import { CHAIN_ID } from 'src/config/chain.d'
import { mockedEndpoints } from 'src/setupTests'
import { fireEvent, getByText, render, screen, waitFor } from 'src/utils/test-utils'
import { generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'
import LoadSafePage from './LoadSafePage'
import * as safeVersion from 'src/logic/safe/utils/safeVersion'
import { GATEWAY_URL } from 'src/utils/constants'

const getENSAddressSpy = jest.spyOn(getWeb3ReadOnly().eth.ens, 'getAddress')
jest.spyOn(getWeb3ReadOnly().eth.ens, 'getResolver')

jest.spyOn(safeVersion, 'getSafeVersionInfo').mockImplementation(async () => ({
  current: '1.3.0',
  latest: '1.3.0',
  needUpdate: false,
}))

const rinkebyNetworkId = '4'
const validSafeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'
const invalidSafeAddress = 'this-is–a-invalid-safe-address-value'
const validSafeENSNameDomain = 'testENSDomain.eth'

describe('<LoadSafePage>', () => {
  it('renders LoadSafePage Form', () => {
    render(<LoadSafePage />)

    expect(screen.getByText('Add existing Safe', { selector: 'h2' })).toBeInTheDocument()
    expect(screen.getByTestId('load-safe-form')).toBeInTheDocument()
  })

  it('shows all steps', () => {
    render(<LoadSafePage />)

    expect(screen.getByText('Select network')).toBeInTheDocument()
    expect(screen.getByText('Name and address')).toBeInTheDocument()
    expect(screen.getByText('Owners')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  describe('Loading a specific Safe from URL', () => {
    beforeAll(() => {
      history.push('/load/rin:0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A')
    })

    afterAll(() => {
      history.push('/load')
    })

    it('hides Select network step if loading a pre-selected safe', async () => {
      render(<LoadSafePage />)

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')

      expect(screen.queryByText('Select network')).not.toBeInTheDocument()
      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')
      const safeNameInputNode = screen.getByTestId('load-safe-name-field')
      expect(safeNameInputNode?.getAttribute('placeholder')).toMatch(/.+-rinkeby-safe/)
      expect((safeAddressInputNode as HTMLInputElement).value).toBe('0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A')
    })

    it('uses a name from Address Book if available', async () => {
      render(<LoadSafePage />, {
        addressBook: [
          {
            address: '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A',
            name: 'Test Safe',
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
      })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')

      expect(screen.queryByText('Select network')).not.toBeInTheDocument()
      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')
      const safeNameInputNode = screen.getByTestId('load-safe-name-field')
      expect(safeNameInputNode?.getAttribute('placeholder')).toBe('Test Safe')
      expect((safeAddressInputNode as HTMLInputElement).value).toBe('0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A')

      // Change the address and check that the placeholder isn't taken from the AB anymore
      fireEvent.change(safeAddressInputNode, { target: { value: '' } })
      fireEvent.change(safeAddressInputNode, { target: { value: '0x3F4b507632681059a136701188bF6217F58c6A10' } })
      await screen.findByTestId('safeAddress-valid-address-adornment')
      expect(safeNameInputNode?.getAttribute('placeholder')).toMatch(/.+-rinkeby-safe/)
    })
  })

  describe('Step 1: Select network', () => {
    it('Shows the current selected network', () => {
      render(<LoadSafePage />)

      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
    })

    it('Shows the Switch Network button', () => {
      render(<LoadSafePage />)

      expect(screen.getByText('Switch Network')).toBeInTheDocument()
    })

    it('Opens the Switch Network popup if clicks on Switch Network button', () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Switch Network'))
      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Ethereum')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
    })

    it('Opens the Switch Network popup if clicks on the current selected Network label', () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Rinkeby'))
      const selectNetworkPopupNode = screen.getByTestId('select-network-popup')
      expect(selectNetworkPopupNode).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Ethereum')).toBeInTheDocument()
      expect(getByText(selectNetworkPopupNode, 'Rinkeby')).toBeInTheDocument()
    })

    it('Switches Network if clicks on Switch Network button', async () => {
      render(<LoadSafePage />)

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

    it('the Switch Network popup can be closed', async () => {
      render(<LoadSafePage />)

      expect(screen.getByText('Rinkeby')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Switch Network'))
      // closes popup
      fireEvent.click(screen.getByLabelText('close'))

      await waitFor(() => expect(screen.getByText('Rinkeby')).toBeInTheDocument())
    })

    it('goes to the next step when clicks on the next button', async () => {
      render(<LoadSafePage />)

      expect(screen.queryByTestId('load-safe-address-step')).not.toBeInTheDocument()

      fireEvent.click(screen.getByText('Continue'))

      await waitFor(() => expect(screen.getByTestId('load-safe-address-step')).toBeInTheDocument())
      expect(screen.queryByTestId('select-network-step')).not.toBeInTheDocument()
    })
  })

  describe('Step 2: Name and address', () => {
    it('Checks if the Safe Address is a valid Safe Address', async () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(0)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      await waitFor(() => {
        fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(GATEWAY_URL, rinkebyNetworkId, validSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(1)
      })
    })

    it('Checksums valid addresses', async () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode: HTMLInputElement = screen.getByTestId('load-safe-address-field')

      await waitFor(() => {
        fireEvent.change(safeAddressInputNode, { target: { value: '0X9913B9180C20C6B0F21B6480C84422F6EBC4B808' } })
      })

      expect(safeAddressInputNode.value).toBe('0x9913B9180C20C6b0F21B6480c84422F6ebc4B808')
    })

    it('Shows an error if the Safe Address is an invalid Safe Address', () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: invalidSafeAddress } })

      expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(0)

      const errorText = 'Must be a valid address, ENS or Unstoppable domain'

      expect(screen.getByText(errorText)).toBeInTheDocument()
    })

    it('Shows an error if the Safe with a given address is not found', async () => {
      // simulating a 404 error by returning a rejected promise
      mockedEndpoints.getSafeInfo.mockImplementation(() =>
        Promise.reject({
          code: 42,
          message: '',
        }),
      )

      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      await waitFor(() => {
        const errorTextNode = screen.getByText('Address given is not a valid Safe address')

        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(GATEWAY_URL, rinkebyNetworkId, validSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(1)

        expect(errorTextNode).toBeInTheDocument()
      })
    })

    it('Gets the Safe Address From a ENS Name Domain', async () => {
      const ensDomains = {
        [validSafeENSNameDomain]: validSafeAddress,
      }

      // mock getAddress fn to return the Safe Address Domain
      getENSAddressSpy.mockImplementation(
        (validSafeENSNameDomain) => new Promise((resolve) => resolve(ensDomains[validSafeENSNameDomain])),
      )

      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeENSNameDomain } })

      await waitFor(() => {
        expect(safeAddressInputNode.value).toBe(validSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(GATEWAY_URL, rinkebyNetworkId, validSafeAddress)
        getENSAddressSpy.mockClear()
      })
    })

    it('Shows an error if a given ENS name is not registered', () => {
      const notExistingENSNameDomain = 'notExistingENSDomain.eth'

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

      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement
      fireEvent.change(safeAddressInputNode, { target: { value: notExistingENSNameDomain } })

      expect(safeAddressInputNode.value).toBe(notExistingENSNameDomain)
      expect(mockedEndpoints.getSafeInfo).not.toHaveBeenCalled()
      const errorTextNode = screen.getByText('Must be a valid address, ENS or Unstoppable domain')

      expect(errorTextNode).toBeInTheDocument()
      getENSAddressSpy.mockClear()
    })

    it('Shows an error if NO valid Safe Address is registered as an ENS name', async () => {
      // simulating a 404 error by returning a rejected promise
      mockedEndpoints.getSafeInfo.mockImplementation(() =>
        Promise.reject({
          code: 42,
          message: '',
        }),
      )

      const ensDomains = {
        [validSafeENSNameDomain]: validSafeAddress, // valid address but not registered as a Safe
      }
      // mock getAddress fn to return the invalid Safe Address Domain
      getENSAddressSpy.mockImplementation((EnsDomain) => new Promise((resolve) => resolve(ensDomains[EnsDomain])))

      render(<LoadSafePage />)
      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeENSNameDomain } })

      await waitFor(() => {
        expect(safeAddressInputNode.value).toBe(validSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(GATEWAY_URL, rinkebyNetworkId, validSafeAddress)
        const errorTextNode = screen.getByText('Address given is not a valid Safe address')

        expect(errorTextNode).toBeInTheDocument()
        getENSAddressSpy.mockClear()
      })
    })

    it('goes to the next owners step when clicks on the next button', async () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      expect(screen.getByTestId('load-safe-owners-step')).toBeInTheDocument()
    })
  })

  describe('Step 3: Owner', () => {
    it('shows the number of owners', async () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      expect(screen.getByText('has 2 owners', { exact: false })).toBeInTheDocument()
    })

    it('shows the owners addresses', async () => {
      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      expect(screen.getByText('0x680cde08860141F9D223cE4E620B10Cd6741037E')).toBeInTheDocument()
      expect(screen.getByText('0xfe8BEBd43Ac213bea4bb8eC9e2dd90632f9371b2')).toBeInTheDocument()
    })

    it('sets a owner name', async () => {
      const myCustomOwnerName = 'My custom owner name'

      render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const ownerInputNode = screen.getByTestId('load-safe-owner-name-0') as HTMLInputElement

      fireEvent.change(ownerInputNode, { target: { value: myCustomOwnerName } })

      expect(ownerInputNode.value).toBe(myCustomOwnerName)
    })

    it('goes to the final step when clicks on the next button', async () => {
      const { container } = render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      expect(screen.getByTestId('load-safe-review-step')).toBeInTheDocument()
    })
  })

  describe('Step 4: Review', () => {
    it('shows the basic info of the Safe', async () => {
      const { container } = render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      expect(screen.getByTestId('load-safe-review-step')).toBeInTheDocument()

      // number of owners
      expect(screen.getByText('Review details')).toBeInTheDocument()

      // number of owners
      expect(screen.getByText('2 Safe owners')).toBeInTheDocument()

      // owner addresses
      const firstOwnerNode = screen.getByTestId('load-safe-review-owner-name-0')
      const secondOwnerNode = screen.getByTestId('load-safe-review-owner-name-1')
      expect(getByText(firstOwnerNode, '0x680cde08860141F9D223cE4E620B10Cd6741037E'))
      expect(getByText(secondOwnerNode, '0xfe8BEBd43Ac213bea4bb8eC9e2dd90632f9371b2'))

      // Safe address
      expect(screen.getByText('0x57CB...E45F')).toBeInTheDocument()

      // Connected wallet
      expect(screen.getByText('No (read-only)')).toBeInTheDocument()

      // threshold
      expect(screen.getByText('1 out of 2 owners')).toBeInTheDocument()

      // Add Safe button
      expect(screen.getByText('Add')).toBeInTheDocument()
    })

    it('shows if connected wallet client is owner', async () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: '4',
        },
      }
      const { container } = render(<LoadSafePage />, customState)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      // Connected wallet
      const firstOwnerNode = screen.getByTestId('connected-wallet-is-owner')
      expect(getByText(firstOwnerNode, 'Yes')).toBeInTheDocument()
    })

    it('shows owner custom names', async () => {
      const { container } = render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const myCustomFirstOwnerName = 'my first custom safe owner'
      const myCustomSecondOwnerName = 'my second custom safe owner'

      const firstOwnerInputNode = screen.getByTestId('load-safe-owner-name-0') as HTMLInputElement

      fireEvent.change(firstOwnerInputNode, { target: { value: myCustomFirstOwnerName } })

      const secondOwnerInputNode = screen.getByTestId('load-safe-owner-name-1') as HTMLInputElement

      fireEvent.change(secondOwnerInputNode, { target: { value: myCustomSecondOwnerName } })

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      // owner name addresses
      const firstOwnerNode = screen.getByTestId('load-safe-review-owner-name-0')
      const secondOwnerNode = screen.getByTestId('load-safe-review-owner-name-1')
      expect(getByText(firstOwnerNode, '0x680cde08860141F9D223cE4E620B10Cd6741037E'))
      expect(getByText(firstOwnerNode, myCustomFirstOwnerName))
      expect(getByText(secondOwnerNode, '0xfe8BEBd43Ac213bea4bb8eC9e2dd90632f9371b2'))
      expect(getByText(secondOwnerNode, myCustomSecondOwnerName))
    })

    it('shows custom safe name', async () => {
      const { container } = render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const customSafeAddressName = 'my custom safe address name'

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const safeNameAddressNode = screen.getByTestId('load-safe-name-field')
      fireEvent.change(safeNameAddressNode, { target: { value: customSafeAddressName } })

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      // Connected wallet
      const safeAddressNameNode = screen.getByTestId('load-form-review-safe-name')
      expect(getByText(safeAddressNameNode, customSafeAddressName)).toBeInTheDocument()
    })

    it('shows name from Address Book', async () => {
      const customSafeAddress = '0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A'
      const abName = 'Test Safe'

      const { container } = render(<LoadSafePage />, {
        addressBook: [
          {
            address: customSafeAddress,
            name: abName,
            chainId: CHAIN_ID.RINKEBY,
          },
        ],
      })

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: customSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      // Go to the review step
      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      const nameDisplay = screen.getByTestId('load-form-review-safe-name')
      expect(nameDisplay.textContent).toBe(abName)
    })
  })

  describe('On submit Load Safe', () => {
    it('On submit Load Safe', async () => {
      const historyPushSpy = jest.spyOn(history, 'push')

      const { container } = render(<LoadSafePage />)

      fireEvent.click(screen.getByText('Continue'))

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      // we wait for the validation of the safe address input
      await screen.findByTestId('safeAddress-valid-address-adornment')
      fireEvent.click(screen.getByText('Next'))

      const reviewButtonNode = container.querySelector('button[type=submit]') as HTMLButtonElement
      fireEvent.click(reviewButtonNode)

      fireEvent.click(screen.getByText('Add'))

      await waitFor(() => {
        expect(historyPushSpy).toHaveBeenCalledWith(
          generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
            shortName: getShortName(),
            safeAddress: validSafeAddress,
          }),
        )
      })
    })
  })
})
