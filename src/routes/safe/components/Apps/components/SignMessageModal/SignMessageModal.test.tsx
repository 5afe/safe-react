import { render, screen } from 'src/utils/test-utils'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { Methods } from '@gnosis.pm/safe-apps-sdk'

import { SignMessageModal } from './'
import { getEmptySafeApp } from '../../utils'

const safeAddress = '0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb'

const customState = {
  providers: {
    name: 'MetaMask',
    loaded: true,
    available: true,
    account: '0x680cde08860141F9D223cE4E620B10Cd6741037E',
    network: '4',
  },
  currentSession: {
    currentSafeAddress: safeAddress,
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

describe('SignMessageModal Component', () => {
  const web3ReadOnly = getWeb3ReadOnly()
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
        method={Methods.signMessage}
        app={getEmptySafeApp()}
      />,
      customState,
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
        method={Methods.signMessage}
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
        method={Methods.signMessage}
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText('SignMessageLib')).toBeVisible()
  })

  test("Displays transaction hash as a message, doesn't convert it", () => {
    const transactionHash = '0x1c953f75ea7aa13bdb365a536b897a34813b438cc3c0582dd70a0cd7851a84cd'

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        message={transactionHash}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        method={Methods.signMessage}
        app={getEmptySafeApp()}
      />,
    )

    expect(screen.getByText(transactionHash)).toBeVisible()
  })

  test('If message is typed data, displays the message correctly', () => {
    const typedMessage = {
      types: {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    }

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        message={typedMessage}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={jest.fn()}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        method={Methods.signTypedMessage}
        app={getEmptySafeApp()}
      />,
    )
    expect(screen.getByText('signTypedMessage')).toBeVisible()
    expect(
      screen.getByText(JSON.stringify(typedMessage), {
        normalizer: (str) => {
          try {
            return JSON.stringify(JSON.parse(str))
          } catch (e) {
            return str
          }
        },
      }),
    ).toBeVisible()
  })

  test('If message is invalid typed data, modal should be closed', () => {
    const onCloseFn = jest.fn()
    const typedMessageStr = { test: 'test' }

    render(
      <SignMessageModal
        isOpen
        safeAddress="0x1948fC557ed7219D33138bD2cD52Da7F2047B2bb"
        // @ts-expect-error - invalid typed message
        message={typedMessageStr}
        safeName="test safe"
        ethBalance="100000000000000000"
        onClose={onCloseFn}
        onUserConfirm={jest.fn()}
        onTxReject={jest.fn()}
        requestId="1"
        method={Methods.signTypedMessage}
        app={getEmptySafeApp()}
      />,
    )
    expect(onCloseFn).toHaveBeenCalled()
  })
})
