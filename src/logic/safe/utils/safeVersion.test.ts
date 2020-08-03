import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { AbiItem } from 'web3-utils'
import Web3 from 'web3'
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { checkIfSafeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'

describe('Check safe version', () => {
  it('Calls checkIfSafeNeedUpdate, should return true if the safe version is bellow the target one', async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(''))
    const safeInstance = (new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[]) as unknown) as GnosisSafe
    // eslint-disable-next-line
    // @ts-ignore
    safeInstance.methods.VERSION = () => ({ call: async () => '1.0.0' })
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeInstance, targetVersion)
    expect(needUpdate).toEqual(true)
  })
  it('Calls checkIfSafeNeedUpdate, should return false if the safe version is over the target one', async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(''))
    const safeInstance = (new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[]) as unknown) as GnosisSafe
    // eslint-disable-next-line
    // @ts-ignore
    safeInstance.methods.VERSION = () => ({ call: async () => '2.0.0' })
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeInstance, targetVersion)
    expect(needUpdate).toEqual(false)
  })
  it('Calls checkIfSafeNeedUpdate, should return false if the safe version is equal the target one', async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(''))
    const safeInstance = (new web3.eth.Contract(GnosisSafeSol.abi as AbiItem[]) as unknown) as GnosisSafe
    // eslint-disable-next-line
    // @ts-ignore
    safeInstance.methods.VERSION = () => ({ call: async () => '1.1.1' })
    const targetVersion = '1.1.1'
    const { needUpdate } = await checkIfSafeNeedsUpdate(safeInstance, targetVersion)
    expect(needUpdate).toEqual(false)
  })
})
