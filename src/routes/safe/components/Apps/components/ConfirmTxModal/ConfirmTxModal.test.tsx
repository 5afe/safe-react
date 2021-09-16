import { render, screen } from 'src/utils/test-utils'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

import { ConfirmTxModal } from './'
import { getEmptySafeApp } from '../../utils'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'

jest.mock('src/logic/hooks/useEstimateTransactionGas', () => ({
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

const MULTISEND_ADDRESS = '0x42424242424242424242424242424242424242424'
jest.mock('src/logic/contracts/safeContracts', () => ({
  ...jest.requireActual('src/logic/contracts/safeContracts'),
  getMultisendContractAddress: () => MULTISEND_ADDRESS,
  getMultisendContract: () => ({
    methods: {
      multiSend: () => ({
        encodeABI: () => '0x',
      }),
    },
  }),
}))

describe('ConfirmTxModal Component', () => {
  test('Shows transaction details correctly for a single, non-multisend transaction', () => {
    const txs: BaseTransaction[] = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        value: '2000000000000000000',
        data: '0x',
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText('Send 2 ETH to:')).toBeInTheDocument()
    expect(screen.getByText(txs[0].to)).toBeInTheDocument()
  })

  test('Shows transaction details correctly for multiple transactions send via multisend', () => {
    const txs: BaseTransaction[] = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        value: '0',
        data: '0x',
      },
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        value: '0',
        data: '0x',
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )

    // No ETH value should be sent to the multisend address
    expect(screen.getByText('Send 0 ETH to:')).toBeInTheDocument()
    expect(screen.getByText(MULTISEND_ADDRESS)).toBeInTheDocument()
  })

  test('Shows malformed txs screen in case the app sends invalid transaction object', () => {
    const txs = [
      {
        value: '0',
        data: '0x',
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
      />,
    )
  })
})
