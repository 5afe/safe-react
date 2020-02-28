// @flow
import axios from 'axios'

import { getRelayUrl } from '~/config/index'

export const estimateTxGas = (safeAddress: string, to: string, value: string, data, operation = 0) => {
  const apiUrl = getRelayUrl()
  const url = `${apiUrl}/safes/${safeAddress}/transactions/estimate/`
  // const estimationValue = isTokenTransfer(tx.data) ? '0' : value.toString(10)

  return axios.post(url, {
    safe: safeAddress,
    to,
    data: '0x',
    value,
    operation,
  })
}
