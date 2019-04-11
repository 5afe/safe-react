// @flow
import { List, Record, Map } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/model/owner'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  owners: List<Owner>,
  tokens?: List<Map<string, string>>,
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  owners: List([]),
  tokens: List([
    {
      address: ETH_ADDRESS,
      balance: '0',
    },
  ]),
})

// Tokens is a list of currently enabled tokens for the safe with balances

export type Safe = RecordOf<SafeProps>

export default SafeRecord
