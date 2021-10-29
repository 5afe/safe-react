import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { render, screen, fireEvent, waitFor } from 'src/utils/test-utils'

const getENSAddressSpy = jest.spyOn(getWeb3ReadOnly().eth.ens, 'getAddress')

const customState = {
  addressBook: [
    {
      address: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
      name: 'test-address',
      chainId: '4',
    },
    {
      address: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
      name: 'safe-test-address',
      chainId: '4',
    },
  ],
}
const invalidNetworkErrorMessage = "The current network doesn't match the given address"

describe('<AddressBookInput>', () => {
  it('Renders AddressInput Component', () => {
    render(
      <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
      customState,
    )

    expect(screen.getByTestId('address-book-input')).toBeInTheDocument()
  })

  it('Shows the network prefix if it is enabled in settings', () => {
    const customState = {
      appearance: {
        copyShortName: true,
        showShortName: true,
      },
    }
    render(
      <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
      customState,
    )

    expect(screen.queryByText('rin:')).toBeInTheDocument()
  })

  it('Hides the network prefix if it is disabled in settings', () => {
    const customState = {
      appearance: {
        copyShortName: false,
        showShortName: false,
      },
    }
    render(
      <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
      customState,
    )

    expect(screen.queryByText('rin:')).not.toBeInTheDocument()
  })

  it('Shows addresses and names stored in the Address Book', () => {
    const fistAddress = customState.addressBook[0].address
    const secondAddress = customState.addressBook[1].address

    const fistAddressName = customState.addressBook[0].name
    const secondAddressName = customState.addressBook[1].name

    render(
      <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
      customState,
    )

    // opens the dropdown
    fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: '0x' } })

    // shows address 1 option
    expect(screen.queryByText(fistAddress)).toBeInTheDocument()
    expect(screen.queryByText(fistAddressName)).toBeInTheDocument()

    // shows address 2 option
    expect(screen.queryByText(secondAddress)).toBeInTheDocument()
    expect(screen.queryByText(secondAddressName)).toBeInTheDocument()
  })

  it('Searches by addresses and names', () => {
    const fistAddress = customState.addressBook[0].address
    const secondAddress = customState.addressBook[1].address

    const fistAddressName = customState.addressBook[0].name
    const secondAddressName = customState.addressBook[1].name

    render(
      <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
      customState,
    )

    // opens the dropdown and search by first address
    fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: fistAddress } })

    // shows address 1 option
    expect(screen.queryByText(fistAddress)).toBeInTheDocument()
    expect(screen.queryByText(fistAddressName)).toBeInTheDocument()

    // hides address 2 option
    expect(screen.queryByText(secondAddress)).not.toBeInTheDocument()
    expect(screen.queryByText(secondAddressName)).not.toBeInTheDocument()

    // opens the dropdown and search by second address name
    fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: secondAddressName } })

    // hides address 1 option
    expect(screen.queryByText(fistAddress)).not.toBeInTheDocument()
    expect(screen.queryByText(fistAddressName)).not.toBeInTheDocument()

    // shows address 2 option
    expect(screen.queryByText(secondAddress)).toBeInTheDocument()
    expect(screen.queryByText(secondAddressName)).toBeInTheDocument()
  })

  describe('Validations', () => {
    describe('Network prefix Validations', () => {
      it('Validates the same Address with different prefix', () => {
        const address = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
        const validPrefix = `rin:${address}`
        const inValidPrefix = `vt:${address}`

        render(
          <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
          customState,
        )

        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // populates the input with an invalid address network
        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: inValidPrefix } })

        // shows the error and the invalid prefix
        expect(screen.queryByText('vt:')).toBeInTheDocument()
        expect(screen.queryByText('rin:')).not.toBeInTheDocument()
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()

        // now with the correct value
        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: validPrefix } })

        expect(screen.queryByText('vt:')).not.toBeInTheDocument()
        expect(screen.queryByText('rin:')).toBeInTheDocument()
        expect((screen.getByTestId('address-book-input') as HTMLInputElement).value).toBe(address)
        expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()
      })

      it('Prefix network is not mandatory', () => {
        const addressWithOutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

        render(
          <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
          customState,
        )

        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: addressWithOutPrefix } })

        // show the current network prefix
        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // Input value without network prefix
        expect((screen.getByTestId('address-book-input') as HTMLInputElement).value).toBe(addressWithOutPrefix)
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

        render(
          <AddressBookInput fieldMutator={jest.fn()} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
          customState,
        )

        expect(screen.queryByText('rin:')).not.toBeInTheDocument()

        // now we update the field with an invalid address network
        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: inValidPrefixedAddress } })

        // show error
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()

        // Input value without network prefix
        expect((screen.getByTestId('address-book-input') as HTMLInputElement).value).toBe(
          '0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33',
        )

        expect(screen.queryByText('rin:')).not.toBeInTheDocument()
        expect(screen.queryByText('vt:')).not.toBeInTheDocument()
      })

      it('Restores the correct prefix if its a valid ENS', async () => {
        const inValidPrefixedAddress = 'vt:0x2D42232C03C12f1dC1448f89dcE33d2d5A47Aa33'
        const addressWithOutPrefix = '0x680cde08860141F9D223cE4E620B10Cd6741037E'
        // mock getAddress fn to return the Safe Address Domain
        getENSAddressSpy.mockImplementation(() => new Promise((resolve) => resolve(addressWithOutPrefix)))

        const fieldMutator = jest.fn()

        render(
          <AddressBookInput fieldMutator={fieldMutator} setIsValidAddress={jest.fn()} setSelectedEntry={jest.fn()} />,
          customState,
        )

        expect(screen.queryByText('rin:')).toBeInTheDocument()

        // populates the field with an invalid address network
        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: inValidPrefixedAddress } })

        // show error
        expect(screen.queryByText(invalidNetworkErrorMessage)).toBeInTheDocument()
        expect(screen.queryByText('vt:')).toBeInTheDocument()

        // now we use a ENS name
        fireEvent.change(screen.getByTestId('address-book-input'), { target: { value: 'test.eth' } })

        await waitFor(() => {
          // ENS resolved with the valid address and prefix
          expect(fieldMutator).toHaveBeenCalledWith(addressWithOutPrefix)
          expect(screen.queryByText('rin:')).toBeInTheDocument()

          // no error is present
          expect(screen.queryByText(invalidNetworkErrorMessage)).not.toBeInTheDocument()
          getENSAddressSpy.mockClear()
        })
      })
    })
  })
})
