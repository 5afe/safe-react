import { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { TENDERLY_SIMULATE_ENDPOINT_URL } from 'src/utils/constants'
import {
  TenderlySimulatePayload,
  TenderlySimulation,
} from 'src/routes/safe/components/Transactions/helpers/Simulation/types'
import { FETCH_STATUS } from 'src/utils/requests'
import { getSimulationLink } from 'src/routes/safe/components/Transactions/helpers/Simulation/simulation'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'

type UseSimulationReturn =
  | {
      simulationRequestStatus: FETCH_STATUS.NOT_ASKED | FETCH_STATUS.ERROR | FETCH_STATUS.LOADING
      simulation: undefined
      simulateTransaction: (
        tx: Omit<BaseTransaction, 'value'>,
        chainId: string,
        safeAddress: string,
        walletAddress: string,
        canExecuteTx: boolean,
        gasLimit: number,
      ) => void
      simulationLink: string
      requestError?: string
      resetSimulation: () => void
    }
  | {
      simulationRequestStatus: FETCH_STATUS.SUCCESS
      simulation: TenderlySimulation
      simulateTransaction: (
        tx: Omit<BaseTransaction, 'value'>,
        chainId: string,
        safeAddress: string,
        walletAddress: string,
        canExecuteTx: boolean,
        gasLimit: number,
      ) => void
      simulationLink: string
      requestError?: string
      resetSimulation: () => void
    }

export const useSimulation = (): UseSimulationReturn => {
  const [simulation, setSimulation] = useState<TenderlySimulation | undefined>()
  const [simulationRequestStatus, setSimulationRequestStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)
  const [requestError, setRequestError] = useState<string | undefined>(undefined)

  const simulationLink = useMemo(() => getSimulationLink(simulation?.simulation.id || ''), [simulation])
  const resetSimulation = useCallback(() => {
    setSimulationRequestStatus(FETCH_STATUS.NOT_ASKED)
    setRequestError(undefined)
    setSimulation(undefined)
  }, [])
  const simulateTransaction = useCallback(
    async (
      tx: Omit<BaseTransaction, 'value'>,
      chainId: string,
      safeAddress: string,
      walletAddress: string,
      canExecuteTx: boolean,
      gasLimit: number,
    ) => {
      setSimulationRequestStatus(FETCH_STATUS.LOADING)
      try {
        const simulationPayload: TenderlySimulatePayload = {
          network_id: chainId,
          from: walletAddress,
          to: tx.to,
          input: tx.data,
          gas: gasLimit,
          gas_price: '0',
          state_objects: {
            [safeAddress]: {
              balance: undefined,
              code: undefined,
              /**
               * If the tx can not be executed (i.e. because signatures are missing)
               * we overwrite the threshold of the contract with 1 such that the tx can be executed with only 1 signature.
               * Otherwise the simulation would always fail when checking the owner signatures.
               */
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
        setRequestError(undefined)
      } catch (error) {
        console.error(error)
        setSimulationRequestStatus(FETCH_STATUS.ERROR)
        setRequestError(error.message)
      }
    },
    [],
  )

  return {
    simulateTransaction,
    simulationRequestStatus,
    simulation,
    simulationLink,
    requestError,
    resetSimulation,
  } as UseSimulationReturn
}
