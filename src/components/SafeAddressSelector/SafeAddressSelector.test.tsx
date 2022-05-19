import { render, screen, fireEvent, getByRole, queryByText, getByText } from 'src/utils/test-utils'
import SafeAddressSelector, { getAddressLabel } from './SafeAddressSelector'
import { CHAIN_ID } from 'src/config/chain.d'

const firstTestSafe = {
  address: '0x9AbC8ed0237fCaB91EF5B6a8B14b8e0FEC9d44db',
  chainId: CHAIN_ID.RINKEBY,
  name: 'First test Safe name',
}
const secondTestSafe = {
  address: '0xdE169a45ED4b076f328EFed20912Cd9880a7D138',
  chainId: CHAIN_ID.RINKEBY,
  name: 'Second test Safe name',
}

const testSafes = [firstTestSafe, secondTestSafe]

describe('<SafeAddressSelector />', () => {
  it('renders SafeAddressSelector component', () => {
    const onChangeSpy = jest.fn()
    render(
      <SafeAddressSelector
        safes={testSafes}
        value={firstTestSafe.address}
        onChange={onChangeSpy}
        shouldShowShortName
      />,
    )

    const selectorNode = screen.getByTestId('safe-selector')
    expect(selectorNode).toBeInTheDocument()
  })

  it('shows the current safe selected', () => {
    const onChangeSpy = jest.fn()
    render(
      <SafeAddressSelector
        safes={testSafes}
        value={firstTestSafe.address}
        onChange={onChangeSpy}
        shouldShowShortName
      />,
    )

    expect(screen.getByRole('textbox', { hidden: true })).toHaveValue(firstTestSafe.address)
  })

  it('shows all the available options', () => {
    const onChangeSpy = jest.fn()
    render(
      <SafeAddressSelector
        safes={testSafes}
        value={firstTestSafe.address}
        onChange={onChangeSpy}
        shouldShowShortName
      />,
    )

    const selectorNode = screen.getByTestId('safe-selector')

    // opens the selector
    fireEvent.mouseDown(getByRole(selectorNode, 'button'))

    const selectorModal = screen.getByRole('presentation')
    expect(selectorModal).toBeInTheDocument()

    expect(queryByText(selectorModal, getAddressLabel(firstTestSafe.address))).toBeInTheDocument()
    expect(queryByText(selectorModal, getAddressLabel(secondTestSafe.address))).toBeInTheDocument()
  })

  it('fires onChange event', () => {
    const onChangeSpy = jest.fn()
    render(
      <SafeAddressSelector
        safes={testSafes}
        value={firstTestSafe.address}
        onChange={onChangeSpy}
        shouldShowShortName
      />,
    )

    const selectorNode = screen.getByTestId('safe-selector')

    // opens the selector
    fireEvent.mouseDown(getByRole(selectorNode, 'button'))

    const selectorModal = screen.getByRole('presentation')
    expect(selectorModal).toBeInTheDocument()

    expect(queryByText(selectorModal, getAddressLabel(firstTestSafe.address))).toBeInTheDocument()
    expect(queryByText(selectorModal, getAddressLabel(secondTestSafe.address))).toBeInTheDocument()

    expect(onChangeSpy).not.toHaveBeenCalled()

    // we select a different Safe
    fireEvent.click(getByText(selectorModal, getAddressLabel(secondTestSafe.address)))

    // called with the new safe address
    expect(onChangeSpy.mock.calls[0][0].target.value).toEqual(secondTestSafe.address)
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
  })
})
