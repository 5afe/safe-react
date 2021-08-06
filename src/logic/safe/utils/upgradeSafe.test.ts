import { getSafeSingletonDeployment, getMultiSendCallOnlyDeployment } from '@gnosis.pm/safe-deployments'
import { AbiItem } from 'web3-utils'
import Web3 from 'web3'

import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { encodeMultiSendCall } from 'src/logic/safe/transactions/multisend'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { MultiSend } from 'src/types/contracts/multi_send'

const SAFE_MASTER_COPY_ADDRESS = '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F'
const DEFAULT_FALLBACK_HANDLER_ADDRESS = '0xd5D82B6aDDc9027B22dCA772Aa68D5d74cdBdF44'

jest.mock('src/logic/contracts/safeContracts', () => ({
  getMultisendContract: jest.fn(),
}))

describe('Upgrade a < 1.3.0 Safe', () => {
  const safeContracts = require('src/logic/contracts/safeContracts')

  it('Calls encodeMultiSendCall with a list of MultiSendTransactionInstanceType and returns the multiSend data encoded', () => {
    const safeAddress = ZERO_ADDRESS
    const web3 = new Web3(new Web3.providers.HttpProvider(''))

    // Mock multisend contract instance
    const multiSendCallOnlyDeployment = getMultiSendCallOnlyDeployment()
    safeContracts.getMultisendContract.mockReturnValue(
      new web3.eth.Contract(multiSendCallOnlyDeployment?.abi as AbiItem[]) as unknown as MultiSend,
    )

    // Mock safe contract instance
    const safeSingletonDeployment = getSafeSingletonDeployment({
      version: '1.1.1',
    })
    const safeMasterContractAddress = SAFE_MASTER_COPY_ADDRESS
    const fallbackHandlerAddress = DEFAULT_FALLBACK_HANDLER_ADDRESS
    const safeInstance = new web3.eth.Contract(safeSingletonDeployment?.abi as AbiItem[]) as unknown as GnosisSafe
    //@ts-expect-error the method was removed in 1.3.0 contracts
    const updateSafeTxData = safeInstance.methods.changeMasterCopy(safeMasterContractAddress).encodeABI()
    const fallbackHandlerTxData = safeInstance.methods.setFallbackHandler(fallbackHandlerAddress).encodeABI()
    const txs = [
      {
        to: safeAddress,
        value: '0',
        data: updateSafeTxData,
      },
      {
        to: safeAddress,
        value: '0',
        data: fallbackHandlerTxData,
      },
    ]
    const expectedEncodedData =
      '0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247de7edef00000000000000000000000034cfac646f301356faa8b21e94227e3583fe3f5f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f08a0323000000000000000000000000d5d82b6addc9027b22dca772aa68d5d74cdbdf440000000000000000000000000000'
    const multiSendTxData = encodeMultiSendCall(txs)
    expect(multiSendTxData).toEqual(expectedEncodedData)
  })
})
