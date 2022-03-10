import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { render, waitFor, act } from 'src/utils/test-utils'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import * as GatewaySDK from '@gnosis.pm/safe-react-gateway-sdk'
import * as addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'

const TestComponent = ({ safeAddress, isInitial }: { safeAddress: string; isInitial: boolean }): null => {
  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    dispatch(fetchSafe(safeAddress, isInitial))
  }, [dispatch, safeAddress])

  return null
}

describe('fetchSafe', () => {
  jest.spyOn(GatewaySDK, 'getSafeInfo')
  jest.spyOn(GatewaySDK, 'getBalances')
  jest.spyOn(addViewedSafe, 'default')

  it('fetches a safe by address', async () => {
    await act(async () => {
      render(<TestComponent safeAddress="0xAdCa2CCcF35CbB27fD757f1c0329DF767f8E38F0" isInitial={false} />)
    })

    await waitFor(() => {
      expect(GatewaySDK.getSafeInfo).toHaveBeenCalledWith(
        'https://safe-client.staging.gnosisdev.com',
        '4',
        '0xAdCa2CCcF35CbB27fD757f1c0329DF767f8E38F0',
      )
      expect(GatewaySDK.getBalances).toHaveBeenCalled()
      expect(addViewedSafe.default).not.toHaveBeenCalled()
    })
  })
})
