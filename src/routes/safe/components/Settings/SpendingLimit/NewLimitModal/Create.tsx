import { Button } from '@gnosis.pm/safe-react-components'
import { FormState, Mutator } from 'final-form'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import GnoForm from 'src/components/forms/GnoForm'
import GnoButton from 'src/components/layout/Button'
import { Amount, Beneficiary, ResetTime, Token } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields'
import Modal from 'src/routes/safe/components/Settings/SpendingLimit/Modal'

const FormContainer = styled.div`
  padding: 24px 8px 24px 24px;
  align-items: center;
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-template-rows: 6fr;
  gap: 16px 8px;
  grid-template-areas:
    'beneficiaryInput beneficiaryScan'
    'tokenInput .'
    'amountInput .'
    'resetTimeLabel resetTimeLabel'
    'resetTimeToggle resetTimeToggle'
    'resetTimeOption resetTimeOption';
`

const YetAnotherButton = styled(GnoButton)`
  &.Mui-disabled {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.5;
  }
`

const formMutators: Record<string, Mutator<{ beneficiary: { name: string } }>> = {
  setBeneficiary: (args, state, utils) => {
    utils.changeValue(state, 'beneficiary', () => args[0])
  },
}

interface NewSpendingLimitProps {
  initialValues?: Record<string, string>
  onCancel: () => void
  onReview: (values) => void
}

const canReview = ({
  invalid,
  submitting,
  dirtyFieldsSinceLastSubmit,
  values: { beneficiary, token, amount },
}: FormState<{ beneficiary: string; token: string; amount: string }>): boolean =>
  !(submitting || invalid || !beneficiary || !token || !amount || !dirtyFieldsSinceLastSubmit)

const Create = ({ initialValues, onCancel, onReview }: NewSpendingLimitProps): ReactElement => {
  return (
    <>
      <Modal.TopBar title="New Spending Limit" titleNote="1 of 2" onClose={onCancel} />

      <GnoForm formMutators={formMutators} onSubmit={onReview} initialValues={initialValues}>
        {(...args) => {
          return (
            <>
              <FormContainer>
                <Beneficiary />
                <Token />
                <Amount />
                <ResetTime />
              </FormContainer>

              <Modal.Footer>
                <Button color="primary" size="md" onClick={onCancel}>
                  Cancel
                </Button>

                {/* TODO: replace this with safe-react-components button. */}
                {/*  This is used as "submit" SRC Button does not triggers submission up until the 2nd click */}
                <YetAnotherButton
                  color="primary"
                  size="medium"
                  variant="contained"
                  type="submit"
                  disabled={!canReview(args[2])}
                >
                  Review
                </YetAnotherButton>
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default Create
