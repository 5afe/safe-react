import { act, renderHook } from '@testing-library/react-hooks'
import { FETCH_STATUS } from 'src/utils/requests'
import { useSimulation } from '../useSimulation'
import axios from 'axios'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { waitFor } from '@testing-library/react'
import { TenderlySimulatePayload, TenderlySimulation } from '../types'

describe('useSimulation()', () => {
  it('should have the correct initital values', () => {
    const { result } = renderHook(() => useSimulation())
    const { simulation, simulationLink, requestError: simulationError, simulationRequestStatus } = result.current

    expect(simulation).toBeUndefined()
    expect(simulationLink).not.toBeUndefined()
    expect(simulationError).toBeUndefined()
    expect(simulationRequestStatus).toEqual(FETCH_STATUS.NOT_ASKED)
  })

  it('should set simulationError on errors and errors can be reset.', async () => {
    const mockAxiosPost = jest.spyOn(axios, 'post')
    mockAxiosPost.mockImplementation(() => Promise.reject({ message: '404 not found' }))
    const { result } = renderHook(() => useSimulation())
    const { simulateTransaction } = result.current

    await act(async () =>
      simulateTransaction(
        { data: '0x123', to: ZERO_ADDRESS },
        '4',
        '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
        '0x57CB13cbef735FbDD65f5f2866638c546464E45E',
        true,
        200_000,
      ),
    )

    await waitFor(() => {
      const { simulationRequestStatus, requestError: simulationError, resetSimulation } = result.current
      expect(simulationRequestStatus).toEqual(FETCH_STATUS.ERROR)
      expect(simulationError).toEqual('404 not found')
    })

    expect(mockAxiosPost).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.resetSimulation()
    })

    expect(result.current.simulationRequestStatus).toEqual(FETCH_STATUS.NOT_ASKED)
    expect(result.current.requestError).toBeUndefined()
  })

  it('should set simulation for executable transaction on success and simulation can be reset.', async () => {
    const safeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'
    const mockAxiosPost = jest.spyOn(axios, 'post')
    const mockAnswer: TenderlySimulation = {
      contracts: [],
      generated_access_list: [],
      transaction: {},
      simulation: {
        status: true,
        id: '123',
      },
    } as any as TenderlySimulation
    mockAxiosPost.mockImplementation((_, data: TenderlySimulatePayload) => {
      if (data.state_objects && typeof data.state_objects[safeAddress]?.storage === 'undefined') {
        return Promise.resolve({ data: mockAnswer })
      } else {
        return Promise.reject('Executable Txs do not mock the threshold of the smart contract')
      }
    })
    const { result } = renderHook(() => useSimulation())
    const { simulateTransaction } = result.current

    await act(async () =>
      simulateTransaction(
        { data: '0x123', to: ZERO_ADDRESS },
        '4',
        safeAddress,
        '0x57CB13cbef735FbDD65f5f2866638c546464E45E',
        true,
        200_000,
      ),
    )

    await waitFor(() => {
      const { simulationRequestStatus, simulation } = result.current
      expect(simulationRequestStatus).toEqual(FETCH_STATUS.SUCCESS)
      expect(simulation?.simulation.status).toBeTruthy()
      expect(simulation?.simulation.id).toEqual('123')
    })

    expect(mockAxiosPost).toHaveBeenCalledTimes(1)

    await act(async () => {
      result.current.resetSimulation()
    })

    expect(result.current.simulationRequestStatus).toEqual(FETCH_STATUS.NOT_ASKED)
    expect(result.current.simulation).toBeUndefined()
  })

  it('should set simulation for not-executable transaction on success', async () => {
    const safeAddress = '0x57CB13cbef735FbDD65f5f2866638c546464E45F'
    const mockAxiosPost = jest.spyOn(axios, 'post')
    const mockAnswer: TenderlySimulation = {
      contracts: [],
      generated_access_list: [],
      transaction: {},
      simulation: {
        status: true,
        id: '123',
      },
    } as any as TenderlySimulation
    mockAxiosPost.mockImplementation((_, data: TenderlySimulatePayload) => {
      if (data.state_objects) {
        const storageFromRequest = data.state_objects[safeAddress]?.storage
        if (storageFromRequest && storageFromRequest[`0x${'4'.padStart(64, '0')}`] === `0x${'1'.padStart(64, '0')}`) {
          return Promise.resolve({ data: mockAnswer })
        }
      }
      return Promise.reject('Non-Executable Txs should overwrite the threshold of the smart contract')
    })
    const { result } = renderHook(() => useSimulation())
    const { simulateTransaction } = result.current

    await act(async () =>
      simulateTransaction(
        { data: '0x123', to: ZERO_ADDRESS },
        '4',
        safeAddress,
        '0x57CB13cbef735FbDD65f5f2866638c546464E45E',
        false,
        200_000,
      ),
    )

    await waitFor(() => {
      const { simulationRequestStatus, simulation } = result.current
      expect(simulationRequestStatus).toEqual(FETCH_STATUS.SUCCESS)
      expect(simulation?.simulation.status).toBeTruthy()
      expect(simulation?.simulation.id).toEqual('123')
    })

    expect(mockAxiosPost).toHaveBeenCalledTimes(1)
  })
})
