import { FormState, Mutator } from 'final-form'
import { ReactElement } from 'react'
import styled from 'styled-components'

import GnoForm from 'src/components/forms/GnoForm'
import { Modal } from 'src/components/Modal'
import { Amount, Beneficiary, ResetTime, Token } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import Hairline from 'src/components/layout/Hairline'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

const FormContainer = styled.div`
  padding: 24px;
  align-items: center;
  display: grid;
  grid-template-columns: 4fr auto;
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
      <ModalHeader onClose={onCancel} title="New spending limit" subTitle={getStepTitle(1, 2)} />
      <Hairline />
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
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onCancel }}
                  confirmButtonProps={{ disabled: !canReview(args[2]), text: 'Review' }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default Create
