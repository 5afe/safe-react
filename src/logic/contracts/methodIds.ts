import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import {
  DataDecoded,
  SAFE_METHOD_ID_TO_NAME,
  SPENDING_LIMIT_METHOD_ID_TO_NAME,
  SPENDING_LIMIT_METHODS_NAMES,
} from 'src/logic/safe/store/models/types/transactions.d'

export const decodeParamsFromSafeMethod = (data: string): DataDecoded | null => {
  const [methodId, params] = [data.slice(0, 10) as keyof typeof SAFE_METHOD_ID_TO_NAME | string, data.slice(10)]

  switch (methodId) {
    // swapOwner
    case '0xe318b52b': {
      const decodedParameters = web3.eth.abi.decodeParameters(['uint', 'address', 'address'], params) as string[]
      return {
        method: SAFE_METHOD_ID_TO_NAME[methodId],
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
        method: SAFE_METHOD_ID_TO_NAME[methodId],
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
        method: SAFE_METHOD_ID_TO_NAME[methodId],
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
        method: SAFE_METHOD_ID_TO_NAME[methodId],
        parameters: [
          { name: '_threshold', type: 'uint', value: decodedParameters[0] },
        ],
      }
    }

    // enableModule
    case '0x610b5925': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address'], params)
      return {
        method: SAFE_METHOD_ID_TO_NAME[methodId],
        parameters: [
          { name: 'module', type: 'address', value: decodedParameters[0] },
        ],
      }
    }

    // disableModule
    case '0xe009cfde': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address'], params)
      return {
        method: SAFE_METHOD_ID_TO_NAME[methodId],
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

export const isSetAllowanceMethod = (data: string): boolean => {
  const methodId = data.slice(0, 10) as keyof typeof SPENDING_LIMIT_METHOD_ID_TO_NAME
  return SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId] === SPENDING_LIMIT_METHODS_NAMES.SET_ALLOWANCE
}

export const decodeParamsFromSpendingLimit = (data: string): DataDecoded | null => {
  const [methodId, params] = [data.slice(0, 10) as keyof typeof SPENDING_LIMIT_METHOD_ID_TO_NAME | string, data.slice(10)]

  switch (methodId) {
    // addDelegate
    case '0xe71bdf41': {
      const decodedParameter = (web3.eth.abi.decodeParameter('address', params) as unknown) as string
      return {
        method: SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId],
        parameters: [
          { name: 'delegate', type: 'address', value: decodedParameter },
        ],
      }
    }

    // setAllowance
    case '0xbeaeb388': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint96', 'uint16', 'uint32'], params)
      return {
        method: SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId],
        parameters: [
          { name: 'delegate', type: 'address', value: decodedParameters[0] },
          { name: 'token', type: 'address', value: decodedParameters[1] },
          { name: 'allowanceAmount', type: 'uint96', value: decodedParameters[2] },
          { name: 'resetTimeMin', type: 'uint16', value: decodedParameters[3] },
          { name: 'resetBaseMin', type: 'uint32', value: decodedParameters[4] },
        ],
      }
    }

    // executeAllowanceTransfer
    case '0x4515641a': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'address', 'uint96', 'address', 'uint96', 'address', 'bytes'], params)
      return {
        method: SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId],
        parameters: [
          { name: "safe", type: "address", value: decodedParameters[0] },
          { name: "token", type: "address", value: decodedParameters[1] },
          { name: "to", type: "address", value: decodedParameters[2] },
          { name: "amount", type: "uint96", value: decodedParameters[3] },
          { name: "paymentToken", type: "address", value: decodedParameters[4] },
          { name: "payment", type: "uint96", value: decodedParameters[5] },
          { name: "delegate", type: "address", value: decodedParameters[6] },
          { name: "signature", type: "bytes", value: decodedParameters[7] }
        ]
      }
    }

    default:
      return null
  }
}

const isSafeMethod = (methodId: string): boolean => {
  return !!SAFE_METHOD_ID_TO_NAME[methodId]
}

const isSpendingLimitMethod = (methodId: string): boolean => {
  return !!SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId]
}

export const decodeMethods = (data: string | null): DataDecoded | null => {
  if(!data?.length) {
    return null
  }

  const [methodId, params] = [data.slice(0, 10), data.slice(10)]

  if (isSafeMethod(methodId)) {
    return decodeParamsFromSafeMethod(data)
  }

  if (isSpendingLimitMethod(methodId)) {
    return decodeParamsFromSpendingLimit(data)
  }

  switch (methodId) {
    // a9059cbb - transfer(address,uint256)
    case '0xa9059cbb': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'uint'], params)
      return {
        method: 'transfer',
        parameters: [
          { name: 'to', type: 'address', value: decodeParameters[0] },
          { name: 'value', type: 'uint', value: decodeParameters[1] },
        ],
      }
    }

    // 23b872dd - transferFrom(address,address,uint256)
    case '0x23b872dd': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'transferFrom',
        parameters: [
          { name: 'from', type: 'address', value: decodeParameters[0] },
          { name: 'to', type: 'address', value: decodeParameters[1] },
          { name: 'value', type: 'uint', value: decodeParameters[2] },
        ],
      }
    }

    // 42842e0e - safeTransferFrom(address,address,uint256)
    case '0x42842e0e': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'safeTransferFrom',
        parameters: [
          { name: 'from', type: 'address', value: decodedParameters[0] },
          { name: 'to', type: 'address', value: decodedParameters[1] },
          { name: 'value', type: 'uint', value: decodedParameters[2] },
        ],
      }
    }

    default:
      return null
  }
}
