import React from 'react'
import { useSelector } from 'react-redux'
import GnoModal from 'src/components/Modal'
import { Token } from 'src/logic/tokens/store/model/token'
import NewSpendingLimit from 'src/routes/safe/components/Settings/SpendingLimit/NewSpendingLimit'
import ReviewSpendingLimit from 'src/routes/safe/components/Settings/SpendingLimit/ReviewSpendingLimit'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

const CREATE = 'CREATE' as const
const REVIEW = 'REVIEW' as const

type Step = typeof CREATE | typeof REVIEW

type SpendingLimitModalReducerState = {
  step: Step
  values: Record<string, string> | null
  txToken: Token | null
}

const newSpendingLimitReducer = (state: SpendingLimitModalReducerState, action) => {
  const { type, newState } = action

  switch (type) {
    case CREATE: {
      return {
        ...state,
        step: CREATE,
      }
    }

    case REVIEW: {
      return {
        ...newState,
        step: REVIEW,
      }
    }
  }
}

const useSpendingLimit = (initialStep: Step) => {
  const [state, dispatch] = React.useReducer(newSpendingLimitReducer, {
    step: initialStep,
    values: null,
    txToken: null,
  })

  const create = React.useCallback(() => dispatch({ type: CREATE }), [])
  const review = React.useCallback((newState) => dispatch({ type: REVIEW, newState }), [])

  return [state, { create, review }]
}

interface SpendingLimitModalProps {
  close: () => void
  open: boolean
}

const SpendingLimitModal = ({ close, open }: SpendingLimitModalProps): React.ReactElement => {
  const classes = useStyles()

  const tokens = useSelector(extendedSafeTokensSelector)
  const [{ step, txToken, values }, { create, review }] = useSpendingLimit(CREATE)

  const handleReview = async (values) => {
    review({
      values,
      txToken: tokens.find((token) => token.address === values.token),
    })
  }

  return (
    <GnoModal
      handleClose={close}
      open={open}
      title="New Spending Limit"
      description="set rules for specific beneficiaries to access funds from this Safe without having to collect all signatures"
      paperClassName={classes.modal}
    >
      {step === CREATE && <NewSpendingLimit initialValues={values} onCancel={close} onReview={handleReview} />}
      {step === REVIEW && <ReviewSpendingLimit onBack={create} onClose={close} txToken={txToken} values={values} />}
    </GnoModal>
  )
}

export default SpendingLimitModal
