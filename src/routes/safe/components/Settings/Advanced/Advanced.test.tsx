import { REMOVE_GUARD_BTN_TEST_ID } from 'src/routes/safe/components/Settings/Advanced/TransactionGuard'
import { render, screen, getByText, fireEvent } from 'src/utils/test-utils'
import { history } from 'src/routes/routes'
import Advanced from '.'

const networkId = '4'
const safeAddress = '0xC245cb45B044d66fbE8Fb33C26c0b28B4fc367B2'
// Set route to settings/advanced
const url = `/rin:${safeAddress}/settings/advanced`
history.location.pathname = url

jest.mock('src/logic/hooks/useEstimateTransactionGas', () => {
  const originalModule = jest.requireActual('src/logic/hooks/useEstimateTransactionGas')
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    useEstimateTransactionGas: () => ({
      txEstimationExecutionStatus: 'SUCCESS',
      gasEstimation: 0,
      gasCost: '0',
      gasCostFormatted: '0',
      gasPrice: '0',
      gasPriceFormatted: '0',
      gasLimit: '0',
      isExecution: true,
      isCreation: false,
      isOffChainSignature: false,
    }),
    EstimationStatus: { LOADING: 'LOADING' },
  }
})

describe('Advanced Settings Component', () => {
  it('Renders Advanced Settings Component', () => {
    const customState = {
      providers: {
        name: 'MetaMask',
        loaded: true,
        available: true,
        account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
        network: networkId,
      },
      safes: {
        safes: {
          [safeAddress]: {
            address: safeAddress,
            nonce: 0,
            modules: null,
            guard: '',
            currentVersion: '1.3.0',
          },
        },
      },
    }

    render(<Advanced />, customState)

    expect(screen.getByText('Safe Nonce')).toBeInTheDocument()
    expect(screen.getByText('Safe Modules')).toBeInTheDocument()
  })

  describe('Transaction Guard', () => {
    it('Shows Transaction guard Section if version is >=1.3.0', () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: '',
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      expect(screen.getByText('Transaction Guard')).toBeInTheDocument()
    })

    it('Hides Transaction guard Section if version is less than 1.3.0', () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: '',
              currentVersion: '1.0.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      expect(screen.queryByText('Transaction guard')).not.toBeInTheDocument()
    })

    it('Shows a label if no transaction guard is set in the current safe', () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: '',
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      expect(screen.getByText('No transaction guard set')).toBeInTheDocument()
    })

    it('Shows the address if a transaction guard is set in the current safe', () => {
      const guardAddress = '0xB40dC6Ccb66b4bA73Bb67e331d28480c9DE71f1E'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: guardAddress,
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      // show the transaction guard address
      expect(screen.getByText(guardAddress)).toBeInTheDocument()
      expect(screen.queryByText('No transaction guard set')).not.toBeInTheDocument()
    })

    it('Shows remove guard popup if provider is a owner', () => {
      const guardAddress = '0xB40dC6Ccb66b4bA73Bb67e331d28480c9DE71f1E'
      const userAccount = '0x680cde08860141F9D223cE4E620B10Cd6741037E'

      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: userAccount,
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: guardAddress,
              owners: [userAccount], // user account as a owner to be able to remove guards
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      const removeGuardBtnNode = screen.getByTestId(`${guardAddress}-${REMOVE_GUARD_BTN_TEST_ID}`)
      expect(removeGuardBtnNode).toBeInTheDocument()

      expect(screen.queryByText('Remove Guard')).not.toBeInTheDocument()

      fireEvent.click(removeGuardBtnNode)

      expect(screen.queryByText('Remove Guard')).toBeInTheDocument()
    })
  })

  describe('Safe Modules', () => {
    it('Shows a label if no Safe Modules is set in the current safe', () => {
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              modules: null,
              guard: '',
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      expect(screen.getByText('No modules enabled')).toBeInTheDocument()
    })

    it('Shows Safe Modules of the current safe', () => {
      const safeModuleAddress = '0xDc9870a07187E856D322EF54624aC8cC659355F4'
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: 0,
              guard: '',
              currentVersion: '1.3.0',
              modules: [['0x0000000000000000000000000000000000000001', safeModuleAddress]],
            },
          },
        },
      }

      render(<Advanced />, customState)

      expect(screen.queryByText('No modules enabled')).not.toBeInTheDocument()
      expect(screen.getByText(safeModuleAddress)).toBeInTheDocument()
    })
  })

  describe('Nonce', () => {
    it('Shows the current Nonce', () => {
      const currentNonce = 12
      const customState = {
        providers: {
          name: 'MetaMask',
          loaded: true,
          available: true,
          account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
          network: networkId,
        },
        safes: {
          safes: {
            [safeAddress]: {
              address: safeAddress,
              nonce: currentNonce,
              modules: null,
              guard: '',
              currentVersion: '1.3.0',
            },
          },
        },
      }

      render(<Advanced />, customState)

      const nonceLabel = screen.getByTestId('current-nonce')
      expect(nonceLabel).toBeInTheDocument()

      expect(getByText(nonceLabel, currentNonce)).toBeInTheDocument()
    })
  })
})
