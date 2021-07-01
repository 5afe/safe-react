import axios from 'axios'
import { getTxServiceUrl } from 'src/config'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  const url = `${getTxServiceUrl()}/owners/${ownerAddress}/safes`
  const res = await axios.get<{ safes: string[] }>(url)
  return res.data.safes
}
