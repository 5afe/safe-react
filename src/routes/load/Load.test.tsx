import { fireEvent, screen, waitFor } from '@testing-library/react'
import { getClientGatewayUrl } from 'src/config'
import { mockedEndpoints } from 'src/setupTests'
import { renderWithProviders } from 'src/utils/test-utils'
import Load from './container/Load'

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

    renderWithProviders(<Load />, customState)

    expect(screen.getByText('Add existing Safe', { selector: 'h2' })).toBeInTheDocument()
    expect(screen.getByTestId('load-safe-form')).toBeInTheDocument()
  })

  it('Should show a No account detected error message if no wallet is connected', () => {
    renderWithProviders(<Load />)

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

      renderWithProviders(<Load />, customState)

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

      renderWithProviders(<Load />, customState)

      const inValidSafeAddress = 'this-is–a-invalid-safe-address-value'

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: inValidSafeAddress } })

      const errorTextNode = screen.getByText('Must be a valid address, ENS or Unstoppable domain')

      expect(errorTextNode).toBeInTheDocument()
    })

    it('should show and error if the Safe Address is not found', async () => {
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

      renderWithProviders(<Load />, customState)

      const safeAddressInputNode = screen.getByTestId('load-safe-address-field')

      fireEvent.change(safeAddressInputNode, { target: { value: validSafeAddress } })

      await waitFor(() => {
        const errorTextNode = screen.getByText('Address given is not a valid Safe address')

        expect(errorTextNode).toBeInTheDocument()
      })
    })
  })
})
