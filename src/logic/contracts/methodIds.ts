import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { DataDecoded, METHOD_TO_ID } from 'src/routes/safe/store/models/types/transactions.d'

export const decodeParamsFromSafeMethod = (data: string): DataDecoded | null => {
  const [methodId, params] = [data.slice(0, 10) as keyof typeof METHOD_TO_ID | string, data.slice(10)]

  switch (methodId) {
    // swapOwner
    case '0xe318b52b': {
      const decodedParameters = web3.eth.abi.decodeParameters(['uint', 'address', 'address'], params) as string[]
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'oldOwner', type: 'address', value: decodedParameters[1] },
          { name: 'newOwner', type: 'address', value: decodedParameters[2] },
        ],
      }
    }

    // addOwnerWithThreshold
    case '0x0d582f13': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'owner', type: 'address', value: decodedParameters[0] },
          { name: '_threshold', type: 'uint', value: decodedParameters[1] },
        ],
      }
    }

    // removeOwner
    case '0xf8dc5dd9': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'oldOwner', type: 'address', value: decodedParameters[1] },
          { name: '_threshold', type: 'uint', value: decodedParameters[2] },
        ],
      }
    }

    // changeThreshold
    case '0x694e80c3': {
      const decodedParameters = web3.eth.abi.decodeParameters(['uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: '_threshold', type: 'uint', value: decodedParameters[0] },
        ],
      }
    }

    // enableModule
    case '0x610b5925': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'module', type: 'address', value: decodedParameters[0] },
        ],
      }
    }

    // disableModule
    case '0xe009cfde': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'prevModule', type: 'address', value: decodedParameters[0] },
          { name: 'module', type: 'address', value: decodedParameters[1] },
        ],
      }
    }

    default:
      return null
  }
}

const isSafeMethod = (methodId: string): boolean => {
  return !!METHOD_TO_ID[methodId]
}

export const decodeMethods = (data: string): DataDecoded | null => {
  if(!data.length) {
    return null
  }

  const [methodId, params] = [data.slice(0, 10), data.slice(10)]

  if (isSafeMethod(methodId)) {
    return decodeParamsFromSafeMethod(data)
  }

  switch (methodId) {
    // a9059cbb - transfer(address,uint256)
    case '0xa9059cbb': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'uint'], params)
      return {
        method: 'transfer',
        parameters: [
          { name: 'to', type: '', value: decodeParameters[0] },
          { name: 'value', type: '', value: decodeParameters[1] },
        ],
      }
    }

    // 23b872dd - transferFrom(address,address,uint256)
    case '0x23b872dd': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'transferFrom',
        parameters: [
          { name: 'from', type: '', value: decodeParameters[0] },
          { name: 'to', type: '', value: decodeParameters[1] },
          { name: 'value', type: '', value: decodeParameters[2] },
        ],
      }
    }

    // 42842e0e - safeTransferFrom(address,address,uint256)
    case '0x42842e0e': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'safeTransferFrom',
        parameters: [
          { name: 'from', type: '', value: decodedParameters[0] },
          { name: 'to', type: '', value: decodedParameters[1] },
          { name: 'value', type: '', value: decodedParameters[2] },
        ],
      }
    }

    default:
      return null
  }
}
