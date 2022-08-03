import { render, screen } from 'src/utils/test-utils'

import { ConfirmTxModal } from './'
import { getEmptySafeApp } from '../../utils'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import * as estimateTxGas from 'src/logic/hooks/useEstimateTransactionGas'

const MULTISEND_ADDRESS = '0x4242424242424242424242424242424242424242'
jest.mock('src/logic/contracts/safeContracts', () => ({
  ...jest.requireActual('src/logic/contracts/safeContracts'),
  getMultiSendCallOnlyContractAddress: () => MULTISEND_ADDRESS,
  getMultiSendCallOnlyContract: () => ({
    methods: {
      multiSend: () => ({
        encodeABI: () => '0x',
      }),
    },
  }),
}))

describe('ConfirmTxModal Component', () => {
  beforeEach(() => {
    jest.spyOn(estimateTxGas, 'calculateTotalGasCost').mockImplementation(() => {
      return {
        gasCost: '0',
        gasCostFormatted: '0',
      }
    })
  })
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
        appId="1"
      />,
    )

    expect(screen.getByText('Interact with (and send 2 ETH to):')).toBeInTheDocument()
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
        appId="1"
      />,
    )

    // No ETH value should be sent to the multisend address
    expect(screen.getByText('Interact with:')).toBeInTheDocument()
    expect(screen.getByText(MULTISEND_ADDRESS)).toBeInTheDocument()
  })

  test('Shows malformed txs screen in case the transaction misses the recipient', () => {
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
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    expect(
      screen.getByText(
        'This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this Safe App for more information.',
      ),
    ).toBeInTheDocument()
  })

  test('Shows malformed txs screen in case the transaction misses value', () => {
    const txs = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    expect(
      screen.getByText(
        'This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this Safe App for more information.',
      ),
    ).toBeInTheDocument()
  })

  test('Shows malformed txs screen in case the transaction misses value', () => {
    const txs = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    expect(
      screen.getByText(
        'This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this Safe App for more information.',
      ),
    ).toBeInTheDocument()
  })

  test('Shows malformed txs screen in case transactions array is empty', () => {
    const txs = []

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
        appId="1"
      />,
    )

    expect(
      screen.getByText(
        'This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this Safe App for more information.',
      ),
    ).toBeInTheDocument()
  })

  test('Accepts value equal 0 as a number (backward compatibility with the legacy v0.x SDKs)', () => {
    const txs = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
        value: 0,
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    expect(screen.getByText('Interact with:')).toBeInTheDocument()
  })

  test('Accepts value equal 2 eth as a number (backward compatibility with the legacy v0.x SDKs)', () => {
    const txs = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
        value: 2000000000000000000,
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    expect(screen.getByText('Interact with (and send 2 ETH to):')).toBeInTheDocument()
  })

  test('Accepts value as a number in multisend transactions (backward compatibility with the legacy v0.x SDKs)', () => {
    const txs = [
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
        value: 2000000000000000000,
      },
      {
        to: '0x75096d02718d1B56BEaE4273b178d34F6695F097',
        data: '0x',
        value: 0,
      },
    ]

    render(
      <ConfirmTxModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        safeName="test safe"
        ethBalance="100000000000000000"
        // @ts-expect-error txs are malformed for testing purposes
        txs={txs}
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        app={getEmptySafeApp()}
        appId="1"
      />,
    )

    // No ETH value should be sent to the multisend address
    expect(screen.getByText('Interact with:')).toBeInTheDocument()
    expect(screen.getByText(MULTISEND_ADDRESS)).toBeInTheDocument()
  })
})
