import { useForm, Form } from 'react-final-form'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

import { render, screen, fireEvent, waitFor } from 'src/utils/test-utils'
import AddressInput from '.'

const fieldName = 'test-field'
const fieldTestId = 'test-field-id'
const invalidNetworkErrorMessage = "The current network doesn't match the given address"

const getENSAddressSpy = jest.spyOn(getWeb3ReadOnly().eth.ens, 'getAddress')

describe('<AddressInput>', () => {
  it('Renders AddressInput Component', () => {
    renderAddressInputWithinForm()

    const inputNode = screen.getByTestId(fieldTestId)

    expect(inputNode).toBeInTheDocument()
  })

  describe('Network prefix Label', () => {
    it('Shows the network prefix', () => {
      renderAddressInputWithinForm()

      expect(screen.queryByText('rin:')).toBeInTheDocument()
    })

    it('Hides the network prefix is disabled in settings', () => {
      const customState = {
        appearance: {
          copyShortName: false,
          showShortName: false,
        },
      }
      const onSubmit = jest.fn()

      renderAddressInputWithinForm(onSubmit, customState)

      expect(screen.queryByText('rin:')).not.toBeInTheDocument()
    })
  })

  describe('validations', () => {
    describe('Required validation', () => {
      it('AddressInput is required when onSubmit', () => {
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
        const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
        const validPrefix = `rin:${address}`
        const inValidPrefix = `vt:${address}`

        renderAddressInputWithinForm()

        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // populates the input with an invalid address network
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefix } })

        // shows the error and the invalid prefix
        expect(screen.queryByText('vt:')).toBeInTheDocument()
        expect(screen.queryByText('rin:')).not.toBeInTheDocument()
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(address)
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()

        // now with the correct value
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: validPrefix } })

        expect(screen.queryByText('vt:')).not.toBeInTheDocument()
        expect(screen.queryByText('rin:')).toBeInTheDocument()
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(address)
        expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()
      })

      it('Validates different Addresses with different prefix', () => {
        const validPrefixedAddress = 'rin:0x680cde08860141F9D223cE4E620B10Cd6741037E'
        const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'

        renderAddressInputWithinForm()

        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // we update the field with the valid prefixed address
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: validPrefixedAddress } })

        // triggers validations on Submit the form
        fireEvent.click(screen.getByTestId('submit-test-form'))

        // Input value without network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(
          '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        )

        expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()

        // now we update the field with an invalid address network
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

        // show error
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()

        // show the invalid network prefix
        expect(screen.queryByText('vt:')).toBeInTheDocument()

        // Input value without network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(
          '0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33',
        )
      })

      it('Prefix network is not mandatory when user populates the field', () => {
        const addressWithOutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

        renderAddressInputWithinForm()

        // we update the field with the address
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: addressWithOutPrefix } })

        // show the current network prefix
        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // Input value without network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(addressWithOutPrefix)

        // no error is showed
        expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()
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

        expect(screen.queryByText('rin:')).not.toBeInTheDocument()

        // now we update the field with an invalid address network
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

        // Input value without network prefix
        expect((screen.getByTestId(fieldTestId) as HTMLInputElement).value).toBe(
          '0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33',
        )

        // show error
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()
        expect(screen.queryByText('rin:')).not.toBeInTheDocument()
        expect(screen.queryByText('vt:')).not.toBeInTheDocument()
      })

      it('Restores the correct prefix if its a valid ENS', async () => {
        const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
        const addressWithOutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
        // mock getAddress fn to return the Safe Address Domain
        getENSAddressSpy.mockImplementation(() => new Promise((resolve) => resolve(addressWithOutPrefix)))
        const onSubmit = jest.fn()

        renderAddressInputWithinForm(onSubmit)

        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // populates the field with an invalid address network
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: inValidPrefixedAddress } })

        // show error
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()
        expect(screen.queryByText('vt:')).toBeInTheDocument()

        // now we use a ENS name
        fireEvent.change(screen.getByTestId(fieldTestId), { target: { value: 'test.eth' } })

        await waitFor(() => {
          const inputNode = screen.getByTestId(fieldTestId) as HTMLInputElement
          // ENS resolved with the valid address and prefix
          expect(inputNode.value).toBe(addressWithOutPrefix)
          expect(screen.queryByText('rin:')).toBeInTheDocument()

          // no error is present
          expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()
          getENSAddressSpy.mockClear()
        })
      })
    })
  })
})

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

function WrapperAddressInput() {
  const testForm = useForm()
  const fieldMutator = (val) => testForm.change(fieldName, val)
  return <AddressInput name={fieldName} fieldMutator={fieldMutator} testId={fieldTestId} />
}

function renderAddressInputWithinForm(onSubmit = jest.fn, customState = {}) {
  return render(
    <FormTestComponent onSubmit={onSubmit}>
      <WrapperAddressInput />
    </FormTestComponent>,
    customState,
  )
}
