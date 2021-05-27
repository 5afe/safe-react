import { Text } from '@gnosis.pm/safe-react-components'
import { FormState, Mutator } from 'final-form'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import GnoForm from 'src/components/forms/GnoForm'
import { Modal } from 'src/components/Modal'
import { Amount, Beneficiary, ResetTime, Token } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields'

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
      <Modal.Header onClose={onCancel}>
        <Modal.Header.Title>
          New spending limit
          <Text size="lg" color="secondaryLight" as="span">
            1 of 2
          </Text>
        </Modal.Header.Title>
      </Modal.Header>

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
