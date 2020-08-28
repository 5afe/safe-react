// 
import abi from 'ethereumjs-abi'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

/*
console.log(`to[${to}] \n\n valieInWei[${valueInWei}] \n\n
  data[${data}] \n\n  operation[${operation}] \n\n  sigs[${sigs}]`)

const gnosisSafe = await getGnosisSafeInstanceAt(address)
await printOutApprove("Remove owner 3", address, await gnosisSafe.getOwners(), tx.get('data'), tx.get('nonce'))
const txData =
  await gnosisSafe.contract.execTransactionIfApproved.getData(address, 0, tx.get('data'), 0, tx.get('nonce'))
const err = await getErrorMessage(address, 0, txData, accounts[2])
*/
export const getErrorMessage = async (to, value, data, from) => {
  const web3 = getWeb3()
  const returnData: any = await web3.eth.call({
    to,
    from,
    value,
    data,
  })
  const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

  return abi.rawDecode(['string'], returnBuffer.slice(4))[0]
}
