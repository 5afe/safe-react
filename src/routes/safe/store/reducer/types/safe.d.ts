import { SafeRecord } from 'src/routes/safe/store/models/safe'
import { Map } from 'immutable'

export type SafesMap = Map<string, SafeRecord>

export interface SafeReducerState {
  defaultSafe: 'NOT_ASKED' | string | undefined
  safes: SafesMap
  latestMasterContractVersion: string
}

interface SafeReducerStateSerialized extends SafeReducerState {
  safes: Record<string, SafeRecordProps>
}

export interface SafeReducerMap extends Map<string, any> {
  toJS(): SafeReducerStateSerialized
  get<K extends keyof SafeReducerState>(key: K): SafeReducerState[K]
}
