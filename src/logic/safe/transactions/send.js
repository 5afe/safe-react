// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Operation } from '~/logic/safe/transactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

export const CALL = 0
export const TX_TYPE_EXECUTION = 'execution'
export const TX_TYPE_CONFIRMATION = 'confirmation'

export const getApprovalTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number,
  sender: string,
) => {
  const txHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    0,
    0,
    0,
    ZERO_ADDRESS,
    ZERO_ADDRESS,
    nonce,
    {
      from: sender,
    },
  )

  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    return contract.methods.approveHash(txHash)
  } catch (err) {
    console.error(`Error while approving transaction: ${err}`)

    throw err
  }
}

export const getExecutionTransaction = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  sender: string,
  sigs: string,
) => {
  try {
    const web3 = getWeb3()
    const contract = new web3.eth.Contract(GnosisSafeSol.abi, safeInstance.address)

    return contract.methods.execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
  } catch (err) {
    console.error(`Error while creating transaction: ${err}`)

    throw err
  }
}
