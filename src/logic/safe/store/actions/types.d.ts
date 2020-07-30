import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { AppReduxState } from 'src/logic/store'

export type Dispatch = ThunkDispatch<AppReduxState, undefined, AnyAction>
