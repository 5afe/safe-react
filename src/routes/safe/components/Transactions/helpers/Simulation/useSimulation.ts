import { useCallback, useMemo, useState } from 'react'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { useSelector } from 'react-redux'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import axios from 'axios'
import { TENDERLY_SIMULATE_ENDPOINT_URL } from 'src/utils/constants'
import {
  TenderlySimulatePayload,
  TenderlySimulation,
} from 'src/routes/safe/components/Transactions/helpers/Simulation/types'
import { FETCH_STATUS } from 'src/utils/requests'
import { getSimulationLink } from 'src/routes/safe/components/Transactions/helpers/Simulation/simulation'

type UseSimulationReturn =
  | {
      simulationRequestStatus: FETCH_STATUS.NOT_ASKED | FETCH_STATUS.ERROR | FETCH_STATUS.LOADING
      simulation: undefined
      simulateTransaction: (data: string) => void
      simulationLink: string
    }
  | {
      simulationRequestStatus: FETCH_STATUS.SUCCESS
      simulation: TenderlySimulation
      simulateTransaction: (data: string) => void
      simulationLink: string
    }

export const useSimulation = (): UseSimulationReturn => {
  const web3 = getWeb3()
  const { chainId, address } = useSelector(currentSafe)
  const userAddress = useSelector(userAccountSelector)
  const [simulation, setSimulation] = useState<TenderlySimulation | undefined>()
  const [simulationRequestStatus, setSimulationRequestStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)

  const simulationLink = useMemo(() => getSimulationLink(simulation?.simulation.id || ''), [simulation])

  const simulateTransaction = useCallback(
    async (data: string) => {
      if (!web3 || !chainId) return

      setSimulationRequestStatus(FETCH_STATUS.LOADING)
      try {
        const latestBlock = await web3.eth.getBlock('latest')
        const blockGasLimit = latestBlock.gasLimit.toString()

        const simulationPayload: TenderlySimulatePayload = {
          network_id: chainId || '4',
          from: userAddress,
          to: address,
          input: data,
          gas: parseInt(blockGasLimit),
          gas_price: '0',
          state_objects: {
            [address]: {
              balance: undefined,
              code: undefined,
              storage: {
                [`0x${'4'.padStart(64, '0')}`]: `0x${'1'.padStart(64, '0')}`,
              },
            },
          },
          save: true,
          save_if_fails: true,
        }

        const simulationResponse = await axios.post(TENDERLY_SIMULATE_ENDPOINT_URL, simulationPayload)
        setSimulation(simulationResponse.data)
        setSimulationRequestStatus(FETCH_STATUS.SUCCESS)
      } catch (error) {
        console.error(error)
        setSimulationRequestStatus(FETCH_STATUS.ERROR)
      }
    },
    [address, chainId, userAddress, web3],
  )

  return {
    simulateTransaction,
    simulationRequestStatus,
    simulation,
    simulationLink,
  } as UseSimulationReturn
}
