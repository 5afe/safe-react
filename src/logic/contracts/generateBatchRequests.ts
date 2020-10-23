import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { BatchRequest } from 'web3-core'
import { AbiItem } from 'web3-utils'

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
type MethodsArgsType = Array<string | number>

 interface Props {
  abi: AbiItem[]
  address: string
  batch?: BatchRequest
  context?: unknown
  methods: Array<string | {method: string, type?: string, args: MethodsArgsType }>
 }

const generateBatchRequests = <ReturnValues>({ abi, address, batch, context, methods }: Props): Promise<ReturnValues> => {
  const contractInstance = new web3.eth.Contract(abi, address)
  const localBatch = new web3.BatchRequest()

  const values = methods.map((methodObject) => {
    let method, type, args: MethodsArgsType = []

    if (typeof methodObject === 'string') {
      method = methodObject
    } else {
      ({ method, type, args } = methodObject)
    }

    return new Promise((resolve) => {
      const resolver = (error, result) => {
        if (error) {
          resolve()
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

        // If batch was provided add to external batch
        batch ? batch.add(request) : localBatch.add(request)
      } catch (e) {
        console.warn('There was an error trying to batch request from web3.', e)
        resolve()
      }
    })
  })

  // TODO fix this so all batch.execute() are handled here
  // If batch was created locally we can already execute it
  // If batch was provided we should execute once we finish to generate the batch,
  // in the outside function where the batch object is created.
  !batch && localBatch.execute()

  // @ts-ignore
  return Promise.all([context, ...values])
}

export default generateBatchRequests
