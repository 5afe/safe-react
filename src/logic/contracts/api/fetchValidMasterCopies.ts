import axios from 'axios'
import { getTxServiceUrl } from 'src/config'

type MasterCopies = {
  address: string
  version: string
}

export const getValidMasterCopies = async (): Promise<MasterCopies[] | undefined> => {
  const url = `${getTxServiceUrl()}/about/master-copies/`
  try {
    const res = await axios.get<MasterCopies[]>(url)
    return res.data
  } catch (error) {
    console.error('Fetching data from master-copies errored', error)
  }
}
