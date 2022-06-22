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
      simulateTransaction: (data: string, to: string, canExecuteTx: boolean, gasLimit?: string) => void
      simulationLink: string
      simulationError?: string
      resetSimulation: () => void
    }
  | {
      simulationRequestStatus: FETCH_STATUS.SUCCESS
      simulation: TenderlySimulation
      simulateTransaction: (data: string, to: string, canExecuteTx: boolean, gasLimit?: string) => void
      simulationLink: string
      simulationError?: string
      resetSimulation: () => void
    }

export const useSimulation = (): UseSimulationReturn => {
  const web3 = getWeb3()
  const { chainId, address: safeAddress } = useSelector(currentSafe)
  const userAddress = useSelector(userAccountSelector)
  const [simulation, setSimulation] = useState<TenderlySimulation | undefined>()
  const [simulationRequestStatus, setSimulationRequestStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)
  const [simulationError, setSimulationError] = useState<string | undefined>(undefined)

  const simulationLink = useMemo(() => getSimulationLink(simulation?.simulation.id || ''), [simulation])
  const resetSimulation = useCallback(() => {
    setSimulationRequestStatus(FETCH_STATUS.NOT_ASKED)
    setSimulationError(undefined)
    setSimulation(undefined)
  }, [])
  const simulateTransaction = useCallback(
    async (data: string, to: string, canExecuteTx: boolean, gasLimit?: string) => {
      if (!web3 || !chainId) return

      setSimulationRequestStatus(FETCH_STATUS.LOADING)
      try {
        const getBlockGasLimit = async () => {
          const latestBlock = await web3.eth.getBlock('latest')
          return parseInt(latestBlock.gasLimit.toString())
        }

        const simulationPayload: TenderlySimulatePayload = {
          network_id: chainId || '4',
          from: userAddress,
          to,
          input: data,
          gas: Number(gasLimit) ?? (await getBlockGasLimit()),
          gas_price: '0',
          state_objects: {
            [safeAddress]: {
              balance: undefined,
              code: undefined,
              storage: canExecuteTx
                ? undefined
                : {
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
        setSimulationError(undefined)
      } catch (error) {
        console.error(error)
        setSimulationRequestStatus(FETCH_STATUS.ERROR)
        setSimulationError(error.message)
      }
    },
    [safeAddress, chainId, userAddress, web3],
  )

  return {
    simulateTransaction,
    simulationRequestStatus,
    simulation,
    simulationLink,
    simulationError,
    resetSimulation,
  } as UseSimulationReturn
}
