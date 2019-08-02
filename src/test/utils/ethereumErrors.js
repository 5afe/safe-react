// @flow
import abi from 'ethereumjs-abi'
import Web3Integration from '~/logic/wallets/web3Integration'

/*
console.log(`to[${to}] \n\n valieInWei[${valueInWei}] \n\n
  data[${data}] \n\n  operation[${operation}] \n\n  sigs[${sigs}]`)

const gnosisSafe = await getGnosisSafeInstanceAt(address)
await printOutApprove("Remove owner 3", address, await gnosisSafe.getOwners(), tx.get('data'), tx.get('nonce'))
const txData =
  await gnosisSafe.contract.execTransactionIfApproved.getData(address, 0, tx.get('data'), 0, tx.get('nonce'))
const err = await getErrorMessage(address, 0, txData, accounts[2])
*/
export const getErrorMessage = async (to: string, value: number, data: string, from: string) => {
  const { web3 } = Web3Integration
  const returnData = await web3.eth.call({
    to,
    from,
    value,
    data,
  })
  const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

  return abi.rawDecode(['string'], returnBuffer.slice(4))[0]
}
