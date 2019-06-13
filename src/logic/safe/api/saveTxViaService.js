// @flow
import axios from 'axios'
import { getTxServiceUriFrom, getTxServiceHost } from '~/config/index'

export const saveTxViaService = (safeAddress: string, to: string, value: string, data, operation = 0) => {
  const txServiceHost = getTxServiceHost()
  const txServiceUri = getTxServiceUriFrom(safeAddress)
  const url = `${txServiceHost}${txServiceUri}`
  // const estimationValue = isTokenTransfer(tx.data) ? '0' : value.toString(10)

  return axios.post(url, {
    safe: safeAddress,
    to,
    data: '0x',
    value,
    operation,
  })
}
