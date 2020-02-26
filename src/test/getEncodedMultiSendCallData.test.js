// @flow
import Web3 from 'web3'
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import {
  DEFAULT_FALLBACK_HANDLER_ADDRESS,
  getEncodedMultiSendCallData,
  SAFE_MASTER_COPY_ADDRESS,
} from '~/logic/contracts/safeContracts'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'


describe('Upgrade a Safe', () => {
  it('Calls getEncodedMultiSendCallData with a list of MultiSendTransactionInstanceType and returns the multiSend data encoded', async () => {
    const safeAddress = ZERO_ADDRESS
    const web3 = new Web3(new Web3.providers.HttpProvider(''))
    const safeInstance = new web3.eth.Contract(GnosisSafeSol.abi)
    const fallbackHandlerTxData = safeInstance.methods.setFallbackHandler(DEFAULT_FALLBACK_HANDLER_ADDRESS).encodeABI()
    const updateSafeTxData = safeInstance.methods.changeMasterCopy(SAFE_MASTER_COPY_ADDRESS).encodeABI()
    const txs = [
      {
        operation: 0,
        to: safeAddress,
        value: 0,
        data: updateSafeTxData,
      },
      {
        operation: 0,
        to: safeAddress,
        value: 0,
        data: fallbackHandlerTxData,
      },
    ]
    const expectedEncodedData = '0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247de7edef00000000000000000000000034cfac646f301356faa8b21e94227e3583fe3f5f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f08a0323000000000000000000000000d5d82b6addc9027b22dca772aa68d5d74cdbdf440000000000000000000000000000'
    const multiSendTxData = getEncodedMultiSendCallData(txs, web3)
    expect(multiSendTxData).toEqual(expectedEncodedData)
  })
})
