import { Form } from 'react-final-form'
import * as web3 from 'src/logic/wallets/getWeb3'

import { render, screen, fireEvent, waitFor } from 'src/utils/test-utils'
import AddressInput from '.'

const fieldName = 'test-field'
const fieldTestId = 'test-field-id'
const invalidNetworkPrefixErrorMessage = 'The chain prefix must match the current network'
const invalidAddressErrorMessage = 'Must be a valid address, ENS or Unstoppable domain'
const unsupportedPrefixError = 'Wrong chain prefix'

const getENSAddressSpy = jest.spyOn(web3, 'getAddressFromDomain')

describe('<AddressInput>', () => {
  it('Renders AddressInput Component', () => {
    renderAddressInputWithinForm()

    const inputNode = screen.getByTestId(fieldTestId)

    expect(inputNode).toBeInTheDocument()
  })

  xit('Resolver ENS names', async () => {
    const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
    const ensName = 'test.eth'

    // mock getAddress fn to return the Address
    getENSAddressSpy.mockImplementation(() => Promise.resolve(address))

    renderAddressInputWithinForm()

    // we use a ENS name
    fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: ensName } })

    await waitFor(() => {
      // the loader is not present
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      expect(screen.queryByDisplayValue(ensName)).not.toBeInTheDocument()

      const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
      // ENS resolved with the valid address
      expect(inputNode.value).toBe(address)

      getENSAddressSpy.mockClear()
    })
  })

  it('Shows a loader while ENS resolution is loading', async () => {
    const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
    const ensName = 'test.eth'

    // mock getAddress fn to return the Address
    getENSAddressSpy.mockImplementation(() => Promise.resolve(address))

    renderAddressInputWithinForm()

    fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: ensName } })

    // get the loader by role=progressbar
    const loaderNode = screen.getByRole('progressbar')

    expect(loaderNode).toBeInTheDocument()

    await waitFor(() => {
      // the loader is not present
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
      // ENS resolved with the valid address
      //expect(inputNode.value).toBe(address)

      getENSAddressSpy.mockClear()
    })
  })

  describe('Address validation', () => {
    it('validates address', () => {
      const invalidAddress = 'this-is-an-invalid-address'

      renderAddressInputWithinForm()

      const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
      fireEvent.change(inputNode, { target: { value: invalidAddress } })
      expect(inputNode.value).toBe(invalidAddress)

      expect(screen.queryByText(invalidAddressErrorMessage)).toBeInTheDocument()
    })

    it('AddressInput is required to submit', () => {
      const onSubmit = jest.fn()

      renderAddressInputWithinForm(onSubmit)

      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.queryByText('Required')).not.toBeInTheDocument()

      // triggers validations on Submit the form
      fireEvent.click(screen.getByTestId('submit-test-form'))

      expect(screen.queryByText('Required')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Network prefix validation', () => {
    it('Validates an ddress with an invalid prefix', () => {
      const customState = {
        appearance: {
          copyShortName: true,
          showShortName: true,
        },
      }
      const onSubmit = jest.fn()

      const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const invalidPrefixAddress = `eth:${address}`

      renderAddressInputWithinForm(onSubmit, customState)

      // populates the input with an invalid prefix network
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: invalidPrefixAddress } })

      // shows the error and the invalid prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(invalidPrefixAddress)
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()
    })

    it('Validates an address with a valid prefix', () => {
      const customState = {
        appearance: {
          copyShortName: true,
          showShortName: true,
        },
      }
      const onSubmit = jest.fn()

      const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const validPrefixAddress = `rin:${address}`

      renderAddressInputWithinForm(onSubmit, customState)

      // now a valid value
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: validPrefixAddress } })

      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(validPrefixAddress)
    })

    it('Validates different Addresses with different prefix', () => {
      const validPrefixedAddress = 'rin:0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const inValidPrefixedAddress = 'eth:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'

      renderAddressInputWithinForm()

      // we update the field with the valid prefixed address
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: validPrefixedAddress } })

      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(validPrefixedAddress)

      // no error is present
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()

      // now invalid address network prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

      // shows prefix error
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()

      // Input value without network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(inValidPrefixedAddress)
    })

    it('Network prefix is not mandatory', () => {
      const addressWithoutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

      renderAddressInputWithinForm()

      // address without prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: addressWithoutPrefix } })

      // Input value with network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(addressWithoutPrefix)

      // no error is showed
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
    })

    it('Prefix network is not added to the given address if its disabled in settings', () => {
      const customState = {
        appearance: {
          copyShortName: false,
          showShortName: false,
        },
      }
      const onSubmit = jest.fn()
      const addressWithoutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

      renderAddressInputWithinForm(onSubmit, customState)

      // address without prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: addressWithoutPrefix } })

      // Input value with network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(addressWithoutPrefix)

      // no error is showed
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
    })

    it('Keeps the two dots (:) char in the input value if no prefix is present', () => {
      const addressWithoutTwoDots = ':0x680cde08860141F9D223cE4E620B10Cd6741037E'

      renderAddressInputWithinForm()

      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: addressWithoutTwoDots } })

      // Input value without network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(addressWithoutTwoDots)

      // no error is showed
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
    })

    it('Validates the network prefix even if its disabled in settings', () => {
      const customState = {
        appearance: {
          copyShortName: false,
          showShortName: false,
        },
      }
      const inValidPrefixedAddress = 'eth:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
      const onSubmit = jest.fn()

      renderAddressInputWithinForm(onSubmit, customState)

      // invalid address network prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

      // input value with the network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(inValidPrefixedAddress)

      // show prefix error
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()
    })

    xit('Resolve ENS names even if a network prefix error is present', async () => {
      const inValidPrefixedAddress = 'eth:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
      const addressFromENS = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const ENSNameAddress = 'test.eth'
      // mock getAddress fn to return the Address
      getENSAddressSpy.mockImplementation(() => Promise.resolve(addressFromENS))

      renderAddressInputWithinForm()

      // invalid address network prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

      // show error
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()

      // now we use a ENS name
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: ENSNameAddress } })

      await waitFor(() => {
        const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
        // ENS resolved with the valid address and prefix
        expect(inputNode.value).toBe(addressFromENS)

        // no error is present
        expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
        getENSAddressSpy.mockClear()
      })
    })

    it('Validates unsupported shortNames', () => {
      const unsupportedPrefixedAddress = 'xxxx:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'

      renderAddressInputWithinForm()

      // invalid address network prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: unsupportedPrefixedAddress } })

      // input value with the network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(unsupportedPrefixedAddress)

      // show prefix error
      expect(screen.queryByText(unsupportedPrefixError)).toBeInTheDocument()
    })

    xdescribe('Checksum address', () => {
      it('Checksum address', () => {
        const rawAddress = '0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const checksumAddress = '0x9913B9180C20C6b0F21B6480c84422F6ebc4B808'

        renderAddressInputWithinForm()

        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddress } })

        // input value with checksum address
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(checksumAddress)
      })

      it('Checksum valid address with prefix', () => {
        const rawAddressWithPrefix = 'rin:0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const checksumAddressWithPrefix = 'rin:0x9913B9180C20C6b0F21B6480c84422F6ebc4B808'

        renderAddressInputWithinForm()

        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddressWithPrefix } })

        // input value with the network prefix and checksum address
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(checksumAddressWithPrefix)
      })

      it('Checksum address only when a valid network prefix is present', () => {
        const rawAddressWithInvalidPrefix = 'eth:0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const rawAddressWithValidPrefix = 'rin:0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const checksumAddressWithPrefix = 'rin:0x9913B9180C20C6b0F21B6480c84422F6ebc4B808'

        renderAddressInputWithinForm()

        // invalid network prefix
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddressWithInvalidPrefix } })

        // checksum is not preformed
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(rawAddressWithInvalidPrefix)

        // prefix error is showed
        expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()

        // valid network prefix
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddressWithValidPrefix } })

        // checksum address with the valid network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(checksumAddressWithPrefix)

        // no prefix error is showed
        expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
      })
    })
  })
})

// this is needed because AddressInput Component is implemented to be with a react final form
function FormTestComponent({ children, onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {children}
          <input type="submit" data-testid="submit-test-form" />
        </form>
      )}
    </Form>
  )
}

function renderAddressInputWithinForm(onSubmit = jest.fn, customState = {}) {
  return render(
    <FormTestComponent onSubmit={onSubmit}>
      <AddressInput name={fieldName} fieldMutator={(x) => x} testId={fieldTestId} />
    </FormTestComponent>,
    customState,
  )
}
