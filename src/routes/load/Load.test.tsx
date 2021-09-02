import { getClientGatewayUrl } from 'src/config'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { mockedEndpoints } from 'src/setupTests'
import { render, fireEvent, screen, waitFor } from 'src/utils/test-utils'
import Load from './container/Load'

const getENSAddressSpy = jest.spyOn(web3ReadOnly.eth.ens, 'getAddress')

describe('<Load>', () => {
  it('Should render Load container and form', () => {
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

    render(<Load />, customState)

    expect(screen.getByText('Add existing Safe', { selector: 'h2' })).toBeInTheDocument()
    expect(screen.getByTestId('load-safe-form')).toBeInTheDocument()
  })

  it('Should show a No account detected error message if no wallet is connected', () => {
    render(<Load />)

    expect(screen.getByText('No account detected')).toBeInTheDocument()
  })

  describe('First Step Load Safe', () => {
    it('Should call getSafeInfo if a valid Safe Address is present', () => {
      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      const validSafeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'

      render(<Load />, customState)

      expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(0)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      expect(mockedEndpoints.getSafeInfo).toBeCalledWith(getClientGatewayUrl(), networkId, validSafeAddress)
      // FIXME: should only call 1 time to the getSafeInfo endpoint see https://github.com/gnosis/safe-react/issues/2668
      // expect(mockedEndpoints.getSafeInfo).toBeCalledTimes(1)
    })

    it('should show and error if the Safe Address is invalid', () => {
      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      render(<Load />, customState)

      const inValidSafeAddress = 'this-is–a-invalid-safe-address-value'

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: inValidSafeAddress } })

      const errorTextNode = screen.getByText('Must be a valid address, ENS or Unstoppable domain')

      expect(errorTextNode).toBeInTheDocument()
    })

    it('Should show and error if the Safe Address is not found', async () => {
      // simulating a 404 error by returning a rejected promise
      mockedEndpoints.getSafeInfo.mockImplementation(() =>
        Promise.reject({
          code: 42,
          message: '',
        }),
      )

      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      const validSafeAddress = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

      render(<Load />, customState)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      await waitFor(() => {
        const errorTextNode = screen.getByText('Address given is not a valid Safe address')

        expect(errorTextNode).toBeInTheDocument()
      })
    })

    it('Should get Safe Address From ENS Name Domain', async () => {
      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      const validSafeENSNameDomain = 'testENSDomain.eth'
      const validSafeAddress = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const ensDomains = {
        [validSafeENSNameDomain]: validSafeAddress,
      }
      // mock getAddress fn to return the Safe Address Domain
      getENSAddressSpy.mockImplementation(
        (validSafeENSNameDomain) => new Promise((resolve) => resolve(ensDomains[validSafeENSNameDomain])),
      )

      render(<Load />, customState)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeENSNameDomain } })

      await waitFor(() => {
        expect(safeAddressInputNode.value).toBe(validSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(getClientGatewayUrl(), networkId, validSafeAddress)
        getENSAddressSpy.mockClear()
      })
    })

    it('Should show and error if it the ENS Name Domain is not registered', () => {
      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      const notExistingENSNameDomain = 'notExistingENSDomain.eth'
      // mock getAddress fn to simulate a non existing ENS domain (rejecting the promise)
      getENSAddressSpy.mockImplementation(
        (notExistingENSNameDomain) => new Promise((reject) => reject(notExistingENSNameDomain)),
      )

      render(<Load />, customState)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: notExistingENSNameDomain } })

      expect(safeAddressInputNode.value).toBe(notExistingENSNameDomain)
      expect(mockedEndpoints.getSafeInfo).not.toHaveBeenCalled()
      const errorTextNode = screen.getByText('Must be a valid address, ENS or Unstoppable domain')

      expect(errorTextNode).toBeInTheDocument()
      getENSAddressSpy.mockClear()
    })

    it('Should show an error if a NO valid Safe Address is registered in the ENS Name Domain', async () => {
      const networkId = '4'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
          smartContractWallet: false,
          hardwareWallet: false,
        },
      }

      // simulating a 404 error by returning a rejected promise
      mockedEndpoints.getSafeInfo.mockImplementation(() =>
        Promise.reject({
          code: 42,
          message: '',
        }),
      )

      const validSafeENSNameDomain = 'testENSDomain.eth'
      const inValidSafeAddress = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const ensDomains = {
        [validSafeENSNameDomain]: inValidSafeAddress,
      }
      // mock getAddress fn to return the invalid Safe Address Domain
      getENSAddressSpy.mockImplementation(
        (inValidSafeAddress) => new Promise((resolve) => resolve(ensDomains[inValidSafeAddress])),
      )

      render(<Load />, customState)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field') as HTMLInputElement

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeENSNameDomain } })

      await waitFor(() => {
        expect(safeAddressInputNode.value).toBe(inValidSafeAddress)
        expect(mockedEndpoints.getSafeInfo).toBeCalledWith(getClientGatewayUrl(), networkId, inValidSafeAddress)
        const errorTextNode = screen.getByText('Address given is not a valid Safe address')

        expect(errorTextNode).toBeInTheDocument()
        getENSAddressSpy.mockClear()
      })
    })
  })
})
