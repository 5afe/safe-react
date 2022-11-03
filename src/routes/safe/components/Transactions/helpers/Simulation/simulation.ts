import {
  TenderlySimulatePayload,
  TenderlySimulation,
} from 'src/routes/safe/components/Transactions/helpers/Simulation/types'
import axios from 'axios'
import { TENDERLY_ORG_NAME, TENDERLY_PROJECT_NAME, TENDERLY_SIMULATE_ENDPOINT_URL } from 'src/utils/constants'

const getSimulation = async (tx: TenderlySimulatePayload): Promise<TenderlySimulation> => {
  const response = await axios.post<TenderlySimulation>(TENDERLY_SIMULATE_ENDPOINT_URL, tx)

  return response.data
}

const isSimulationEnvSet =
  Boolean(TENDERLY_SIMULATE_ENDPOINT_URL) && Boolean(TENDERLY_ORG_NAME) && Boolean(TENDERLY_PROJECT_NAME)

const getSimulationLink = (simulationId: string): string => {
  return `https://dashboard.tenderly.co/public/${TENDERLY_ORG_NAME}/${TENDERLY_PROJECT_NAME}/simulator/${simulationId}`
}

export { getSimulationLink, getSimulation, isSimulationEnvSet }
