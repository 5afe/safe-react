import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'

/**
 * Generates a batch request for grouping RPC calls
 * @param {object} args
 * @param {object} args.abi - contract ABI
 * @param {string} args.address - contract address
 * @param {object|undefined} args.batch - not required. If set, batch must be initialized outside (web3.BatchRequest)
 * @param {object|undefined} args.context - not required. Can be any object, to be added to the batch response
 * @param {array<{ args: [any], method: string, type: 'eth'|undefined } | string>} args.methods - methods to be called
 * @returns {Promise<[*]>}
 */
const generateBatchRequests = ({ abi, address, batch, context, methods }: any): any => {
  const contractInstance: any = new web3.eth.Contract(abi, address)
  const localBatch = batch ? null : new web3.BatchRequest()

  const values = methods.map((methodObject) => {
    let method, type, args = []

    if (typeof methodObject === 'string') {
      method = methodObject
    } else {
      ;({ method, type, args = [] } = methodObject)
    }

    return new Promise((resolve) => {
      const resolver = (error, result) => {
        if (error) {
          resolve(null)
        } else {
          resolve(result)
        }
      }

      try {
        let request
        if (type !== undefined) {
          request = web3[type][method].request(...args, resolver)
        } else {
          request = contractInstance.methods[method](...args).call.request(resolver)
        }
        batch ? batch.add(request) : localBatch.add(request)
      } catch (e) {
        resolve(null)
      }
    })
  })

  localBatch && localBatch.execute()

  const returnValues = context ? [context, ...values] : values

  return Promise.all(returnValues)
}

export default generateBatchRequests
