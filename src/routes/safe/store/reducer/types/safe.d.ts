import { SafeRecord, SafeRecordProps } from 'src/routes/safe/store/models/safe'
import { Map } from 'immutable'

export type SafesMap = Map<string, SafeRecord>

export type DefaultSafe = 'NOT_ASKED' | string | undefined

export interface SafeReducerState {
  defaultSafe: DefaultSafe
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
