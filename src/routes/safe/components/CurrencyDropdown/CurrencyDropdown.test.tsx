import { fireEvent, render, screen, getByText, waitFor, queryByText } from 'src/utils/test-utils'
import { CurrencyDropdown } from '.'
import { history, ROOT_ROUTE } from 'src/routes/routes'
import { mockedEndpoints } from 'src/setupTests'

const mockedAvailableCurrencies = ['USD', 'EUR', 'AED', 'AFN', 'ALL', 'ARS']
const rinkebyNetworkId = '4'

describe('<CurrencyDropdown>', () => {
  it('renders CurrencyDropdown Component with USD as initial selected currency', () => {
    render(<CurrencyDropdown testId="testId" />)

    const currencySelector = screen.getByRole('button')
    expect(getByText(currencySelector, 'USD')).toBeInTheDocument()
  })

  it('loads selected currency from state', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: '4',
      },
      currencyValues: {
        selectedCurrency: 'EUR',
        availableCurrencies: mockedAvailableCurrencies,
      },
    }
    render(<CurrencyDropdown testId="testId" />, customState)

    const currencySelector = screen.getByRole('button')
    expect(getByText(currencySelector, 'EUR')).toBeInTheDocument()
  })

  it('changes the selected currency and updates localStorage', async () => {
    const safeAddress = '0xC245cb45B044d66fbE8Fb33C26c0b28B4fc367B2'
    const url = `/rin:${safeAddress}/balances`
    history.location.pathname = url
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: '4',
      },
      currencyValues: {
        selectedCurrency: 'USD',
        availableCurrencies: mockedAvailableCurrencies,
      },
      safes: {
        safes: {
          [safeAddress]: {
            address: safeAddress,
          },
        },
      },
      currentSession: {
        currentSafeAddress: safeAddress,
      },
    }
    render(<CurrencyDropdown testId="testId" />, customState)

    const currencySelector = screen.getByRole('button')
    expect(getByText(currencySelector, 'USD')).toBeInTheDocument()

    // opens the Currency Dropdown modal
    fireEvent.click(currencySelector)

    // shows the currency modal
    const currencyModal = screen.getByRole('menu')
    expect(currencyModal).toBeInTheDocument()

    // shows all currencies
    mockedAvailableCurrencies.forEach((currency) => {
      expect(getByText(currencyModal, currency)).toBeInTheDocument()
    })

    expect(mockedEndpoints.getBalances).toBeCalledTimes(0)

    // clicks on a new selected currency
    const selectedCurrency = 'EUR'
    fireEvent.click(getByText(currencyModal, selectedCurrency))

    // getBalances endpoint has been called
    expect(mockedEndpoints.getBalances).toBeCalledTimes(1)
    expect(mockedEndpoints.getBalances).toBeCalledWith(rinkebyNetworkId, safeAddress, selectedCurrency, {
      exclude_spam: true,
      trusted: false,
    })

    // updates localStorage with the new selected currency
    await waitFor(() => expect(localStorage.getItem('SAFE__currencyValues.selectedCurrency')).toBe('"EUR"'))

    history.location.pathname = ROOT_ROUTE
  })

  it('Filters by a currency', async () => {
    const safeAddress = '0xC245cb45B044d66fbE8Fb33C26c0b28B4fc367B2'
    const url = `/rin:${safeAddress}/balances`
    history.location.pathname = url
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: '4',
      },
      currencyValues: {
        selectedCurrency: 'USD',
        availableCurrencies: mockedAvailableCurrencies,
      },
      safes: {
        safes: {
          [safeAddress]: {
            address: safeAddress,
          },
        },
      },
    }
    render(<CurrencyDropdown testId="testId" />, customState)

    const currencySelector = screen.getByRole('button')
    expect(getByText(currencySelector, 'USD')).toBeInTheDocument()

    // opens the Currency Dropdown modal
    fireEvent.click(currencySelector)

    // filters by currency
    const searchInputNode = screen.getByLabelText('search')
    fireEvent.change(searchInputNode, { target: { value: 'US' } })

    const currencyModal = screen.getByRole('menu')

    // shows only USD currency
    expect(getByText(currencyModal, 'USD')).toBeInTheDocument()

    expect(queryByText(currencyModal, 'EUR')).not.toBeInTheDocument()
    expect(queryByText(currencyModal, 'AED')).not.toBeInTheDocument()
    expect(queryByText(currencyModal, 'AFN')).not.toBeInTheDocument()
    expect(queryByText(currencyModal, 'ALL')).not.toBeInTheDocument()
    expect(queryByText(currencyModal, 'ARS')).not.toBeInTheDocument()

    history.location.pathname = ROOT_ROUTE
  })
})
