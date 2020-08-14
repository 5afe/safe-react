import { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { Map } from 'immutable'

export type SafesMap = Map<string, SafeRecord>

export type DefaultSafe = 'NOT_ASKED' | string | undefined

export interface SafeReducerState {
  defaultSafe: DefaultSafe
  safes: SafesMap
  latestMasterContractVersion: string
}

interface SafeReducerStateJSON {
  defaultSafe: 'NOT_ASKED' | string | undefined
  safes: Record<string, SafeRecordProps>
  latestMasterContractVersion: string
}

export interface SafeReducerMap extends Map<string, any> {
  toJS(): SafeReducerStateJSON
  get<K extends keyof SafeReducerState>(key: K): SafeReducerState[K]
}
