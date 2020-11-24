import {
  DataDecoded,
  SAFE_METHOD_ID_TO_NAME,
  SAFE_METHODS_NAMES,
  SPENDING_LIMIT_METHOD_ID_TO_NAME,
  SPENDING_LIMIT_METHODS_NAMES,
  TOKEN_TRANSFER_METHOD_ID_TO_NAME,
  TOKEN_TRANSFER_METHODS_NAMES,
} from 'src/logic/safe/store/models/types/transactions.d'
import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { sameString } from 'src/utils/strings'

type DecodeInfoProps = {
  paramsHash: string
  params: Record<string, string>
}

const decodeInfo = ({ paramsHash, params }: DecodeInfoProps): DataDecoded['parameters'] => {
  const decodedParameters = web3.eth.abi.decodeParameters(Object.values(params), paramsHash)

  return Object.keys(params).map((name, index) => ({
    name,
    type: params[name],
    value: decodedParameters[index],
  }))
}

export const decodeParamsFromSafeMethod = (data: string): DataDecoded | null => {
  const [methodId, paramsHash] = [data.slice(0, 10), data.slice(10)]
  const method = SAFE_METHODS_NAMES[methodId]

  switch (method) {
    case SAFE_METHODS_NAMES.SWAP_OWNER: {
      const params = {
        prevOwner: 'address',
        oldOwner: 'address',
        newOwner: 'address',
      }

      // we only need to return the addresses that has been swapped, no need for the `prevOwner`
      const [, oldOwner, newOwner] = decodeInfo({ paramsHash, params })

      return { method, parameters: [oldOwner, newOwner] }
    }

    case SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD: {
      const params = {
        owner: 'address',
        _threshold: 'uint',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SAFE_METHODS_NAMES.REMOVE_OWNER: {
      const params = {
        prevOwner: 'address',
        owner: 'address',
        _threshold: 'uint',
      }

      // we only need to return the removed owner and the new threshold, no need for the `prevOwner`
      const [, oldOwner, threshold] = decodeInfo({ paramsHash, params })

      return { method, parameters: [oldOwner, threshold] }
    }

    case SAFE_METHODS_NAMES.CHANGE_THRESHOLD: {
      const params = {
        _threshold: 'uint',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SAFE_METHODS_NAMES.ENABLE_MODULE: {
      const params = {
        module: 'address',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SAFE_METHODS_NAMES.DISABLE_MODULE: {
      const params = {
        prevModule: 'address',
        module: 'address',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    default:
      return null
  }
}

export const isSetAllowanceMethod = (data: string): boolean => {
  const methodId = data.slice(0, 10)
  return sameString(SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId], SPENDING_LIMIT_METHODS_NAMES.SET_ALLOWANCE)
}

export const isDeleteAllowanceMethod = (data: string): boolean => {
  const methodId = data.slice(0, 10)
  return sameString(SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId], SPENDING_LIMIT_METHODS_NAMES.DELETE_ALLOWANCE)
}

export const decodeParamsFromSpendingLimit = (data: string): DataDecoded | null => {
  const [methodId, paramsHash] = [data.slice(0, 10), data.slice(10)]
  const method = SPENDING_LIMIT_METHOD_ID_TO_NAME[methodId]

  switch (method) {
    case SPENDING_LIMIT_METHODS_NAMES.ADD_DELEGATE: {
      const params = {
        delegate: 'address',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SPENDING_LIMIT_METHODS_NAMES.SET_ALLOWANCE: {
      const params = {
        delegate: 'address',
        token: 'address',
        allowanceAmount: 'uint96',
        resetTimeMin: 'uint16',
        resetBaseMin: 'uint32',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SPENDING_LIMIT_METHODS_NAMES.EXECUTE_ALLOWANCE_TRANSFER: {
      const params = {
        safe: 'address',
        token: 'address',
        to: 'address',
        amount: 'uint96',
        paymentToken: 'address',
        payment: 'uint96',
        delegate: 'address',
        signature: 'bytes',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case SPENDING_LIMIT_METHODS_NAMES.DELETE_ALLOWANCE: {
      const params = {
        delegate: 'address',
        token: 'address',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
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
  if (!data?.length) {
    return null
  }

  const [methodId, paramsHash] = [data.slice(0, 10), data.slice(10)]

  if (isSafeMethod(methodId)) {
    return decodeParamsFromSafeMethod(data)
  }

  if (isSpendingLimitMethod(methodId)) {
    return decodeParamsFromSpendingLimit(data)
  }

  const method = TOKEN_TRANSFER_METHOD_ID_TO_NAME[methodId]

  switch (method) {
    case TOKEN_TRANSFER_METHODS_NAMES.TRANSFER: {
      const params = {
        to: 'address',
        value: 'uint',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    case TOKEN_TRANSFER_METHODS_NAMES.TRANSFER_FROM:
    case TOKEN_TRANSFER_METHODS_NAMES.SAFE_TRANSFER_FROM: {
      const params = {
        from: 'address',
        to: 'address',
        value: 'uint',
      }

      const parameters = decodeInfo({ paramsHash, params })

      return { method, parameters }
    }

    default:
      return null
  }
}
