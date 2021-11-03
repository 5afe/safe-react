import { useState } from 'react'
import { Form } from 'react-final-form'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

import { render, screen, fireEvent, waitFor } from 'src/utils/test-utils'
import AddressInput from '.'

const fieldName = 'test-field'
const fieldTestId = 'test-field-id'
const invalidNetworkPrefixErrorMessage = "The current network doesn't match the given address"
const invalidAddressErrorMessage = 'Must be a valid address, ENS or Unstoppable domain'

const getENSAddressSpy = jest.spyOn(getWeb3ReadOnly().eth.ens, 'getAddress')

describe('<AddressInput>', () => {
  it('Renders AddressInput Component', () => {
    renderAddressInputWithinForm()

    const inputNode = screen.getByTestId(fieldTestId)

    expect(inputNode).toBeInTheDocument()
  })

  it('Resolver ENS names', async () => {
    const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
    const ENSNameAddress = 'test.eth'

    // mock getAddress fn to return the Address
    getENSAddressSpy.mockImplementation(() => new Promise((resolve) => resolve(address)))

    renderAddressInputWithinForm()

    // we use a ENS name
    fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: ENSNameAddress } })

    await waitFor(() => {
      const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
      // ENS resolved with the valid address
      expect(inputNode.value).toBe(address)

      getENSAddressSpy.mockClear()
    })
  })

  describe('Address validation', () => {
    it('validates address', () => {
      const invalidAddress = 'this-is-an-invalid-address'

      renderAddressInputWithinForm()

      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: invalidAddress } })

      expect(screen.queryByText(invalidAddressErrorMessage)).toBeInTheDocument()
    })

    it('AddressInput is required when submit', () => {
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
    it('Validates the same Address with different prefix', () => {
      const customState = {
        appearance: {
          copyShortName: true,
          showShortName: true,
        },
      }
      const onSubmit = jest.fn()

      const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const validPrefixAddress = `rin:${address}`
      const inValidPrefixAddress = `vt:${address}`

      renderAddressInputWithinForm(onSubmit, customState)

      // populates the input with an invalid prefix network
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixAddress } })

      // shows the error and the invalid prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(inValidPrefixAddress)
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()

      // now a valid value
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: validPrefixAddress } })

      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(validPrefixAddress)
    })

    it('Validates different Addresses with different prefix', () => {
      const validPrefixedAddress = 'rin:0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'

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

    it('Prefix network is not mandatory', () => {
      const addressWithoutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

      renderAddressInputWithinForm()

      // address without prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: addressWithoutPrefix } })

      // Input value without network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(addressWithoutPrefix)

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
      const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
      const onSubmit = jest.fn()

      renderAddressInputWithinForm(onSubmit, customState)

      // invalid address network prefix
      fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

      // input value with the network prefix
      expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(inValidPrefixedAddress)

      // show prefix error
      expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).toBeInTheDocument()
    })

    it('Resolver ENS names even if a network prefix error is present', async () => {
      const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
      const addressWithOutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
      const ENSNameAddress = 'test.eth'
      // mock getAddress fn to return the Address
      getENSAddressSpy.mockImplementation(() => new Promise((resolve) => resolve(addressWithOutPrefix)))

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
        expect(inputNode.value).toBe(addressWithOutPrefix)

        // no error is present
        expect(screen.queryByText(invalidNetworkPrefixErrorMessage)).not.toBeInTheDocument()
        getENSAddressSpy.mockClear()
      })
    })

    describe('Checksum address', () => {
      it('Checksum address', () => {
        const rawAddress = '0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const checksumAddress = '0x9913B9180C20C6b0F21B6480c84422F6ebc4B808'

        renderAddressInputWithinForm()

        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddress } })

        // input value with the network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(checksumAddress)
      })

      it('Checksum valid address with prefix', () => {
        const rawAddressWithPrefix = 'rin:0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
        const checksumAddressWithPrefix = 'rin:0x9913B9180C20C6b0F21B6480c84422F6ebc4B808'

        renderAddressInputWithinForm()

        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: rawAddressWithPrefix } })

        // input value with the network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(checksumAddressWithPrefix)
      })

      it('Checksum address only when a valid network prefix is present', () => {
        const rawAddressWithInvalidPrefix = 'vt:0X9913B9180C20C6B0F21B6480C84422F6EBC4B808'
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
          <input type={'submit'} data-testid={'submit-test-form'} />
        </form>
      )}
    </Form>
  )
}

function WrapperAddressField() {
  const [value, setValue] = useState('')
  const fieldMutator = (val) => {
    setValue(val)
  }
  return <AddressInput value={value} name={fieldName} fieldMutator={fieldMutator} testId={fieldTestId} />
}

function renderAddressInputWithinForm(onSubmit = jest.fn, customState = {}) {
  return render(
    <FormTestComponent onSubmit={onSubmit}>
      <WrapperAddressField />
    </FormTestComponent>,
    customState,
  )
}
