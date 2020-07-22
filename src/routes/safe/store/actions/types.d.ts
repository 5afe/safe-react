import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { AppReduxState } from 'src/store'

export type Dispatch = ThunkDispatch<AppReduxState, undefined, AnyAction>
