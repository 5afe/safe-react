import { render, screen } from 'src/utils/test-utils'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

import { SignMessageModal } from './'
import { getEmptySafeApp } from '../../utils'

jest.mock('../../../../../../logic/hooks/useEstimateTransactionGas', () => ({
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
}))

describe('SignMessageModal Component', () => {
  test('Converts message from HEX to UTF-8', () => {
    const hexMessage = '0x74657374206d657373616765'
    const utf8Message = web3ReadOnly.utils.hexToUtf8(hexMessage)

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        message={hexMessage}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText(utf8Message)).toBeVisible()
    expect(screen.queryByText(hexMessage)).not.toBeInTheDocument()
  })

  test('If message is UTF-8 encoded, displays the message correctly', () => {
    const hexMessage = '0x74657374206d657373616765'
    const utf8Message = web3ReadOnly.utils.hexToUtf8(hexMessage)

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        message={utf8Message}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText(utf8Message)).toBeVisible()
    expect(screen.queryByText(hexMessage)).not.toBeInTheDocument()
  })

  test('Shows that the transaction destination name is SignMessageLib', () => {
    const hexMessage = '0x74657374206d657373616765'

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        message={hexMessage}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText('SignMessageLib')).toBeVisible()
  })
})
