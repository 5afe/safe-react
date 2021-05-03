import { List } from 'immutable'
import React, { ReactElement, Reducer, useCallback, useReducer } from 'react'
import { useSelector } from 'react-redux'

import { Modal } from 'src/components/Modal'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

import Create from './Create'
import { ReviewSpendingLimits } from './Review'

export const CREATE = 'CREATE' as const
export const REVIEW = 'REVIEW' as const

type Step = typeof CREATE | typeof REVIEW

type State = {
  step: Step
  values: Record<string, string>
  txToken: Token
}

type Action = {
  type: Step
  newState: State
  tokens: List<Token>
}

const newLimitModalReducer = (state: State, action: Action): State => {
  const { type, newState, tokens } = action

  switch (type) {
    case CREATE: {
      return {
        ...state,
        step: CREATE,
      }
    }

    case REVIEW: {
      return {
        ...state,
        ...newState,
        // we lookup into the list of tokens for the selected token info
        txToken: tokens.find((token) => sameAddress(token.address, newState.values.token)) ?? state.txToken,
        step: REVIEW,
      }
    }
  }
}

export type ActionCallback = (state: State) => void
type NewLimitModalHook = [State, { create: ActionCallback; review: ActionCallback }]

const useNewLimitModal = (initialStep: Step): NewLimitModalHook => {
  // globally stored tokens
  const tokens = useSelector(extendedSafeTokensSelector)

  // setup the reducer with initial values
  const [state, dispatch] = useReducer<Reducer<State, Action>, State>(
    newLimitModalReducer,
    {
      step: initialStep,
      txToken: makeToken(),
      values: {},
    },
    (state) => state,
  )

  // define actions
  const create = useCallback<ActionCallback>((newState) => dispatch({ type: CREATE, newState, tokens }), [tokens])
  const review = useCallback<ActionCallback>((newState) => dispatch({ type: REVIEW, newState, tokens }), [tokens])

  // returns state and dispatch
  return [state, { create, review }]
}

interface SpendingLimitModalProps {
  close: () => void
  open: boolean
}

export const NewLimitModal = ({ close, open }: SpendingLimitModalProps): ReactElement => {
  // state and dispatch
  const [{ step, txToken, values }, { create, review }] = useNewLimitModal(CREATE)

  const handleReview = async (values) => {
    // if form is valid, we update the state to REVIEW and sets values
    review({ step, txToken, values })
  }

  return (
    <Modal
      handleClose={close}
      open={open}
      title="New spending limit"
      description="set rules for specific beneficiaries to access funds from this Safe without having to collect all signatures"
    >
      {step === CREATE && <Create initialValues={values} onCancel={close} onReview={handleReview} />}
      {step === REVIEW && <ReviewSpendingLimits onBack={create} onClose={close} txToken={txToken} values={values} />}
    </Modal>
  )
}
