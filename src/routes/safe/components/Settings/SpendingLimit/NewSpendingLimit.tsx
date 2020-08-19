import { Button, Icon, Text, Title } from '@gnosis.pm/safe-react-components'
import { Mutator } from 'final-form'
import React from 'react'
import GnoForm from 'src/components/forms/GnoForm'
import GnoButton from 'src/components/layout/Button'
import { Amount } from 'src/routes/safe/components/Settings/SpendingLimit/Amount'
import BeneficiarySelect from 'src/routes/safe/components/Settings/SpendingLimit/BeneficiarySelect'
import {
  TitleSection,
  StyledButton,
  FooterSection,
  FooterWrapper,
} from 'src/routes/safe/components/Settings/SpendingLimit/index'
import ResetTime from 'src/routes/safe/components/Settings/SpendingLimit/ResetTime'
import TokenSelect from 'src/routes/safe/components/Settings/SpendingLimit/TokenSelect'
import styled from 'styled-components'

const FormContainer = styled.div`
  padding: 24px;
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

const canReview = ({ invalid, submitting, dirtyFieldsSinceLastSubmit, values }): boolean => {
  return !(
    submitting ||
    invalid ||
    !values.beneficiary ||
    (values.token && !values.amount) ||
    // TODO: review the next validation, as resetTime has a default value, this check looks unnecessary
    (values.withResetTime && !values.resetTime) ||
    !dirtyFieldsSinceLastSubmit
  )
}

const NewSpendingLimit = ({ initialValues, onCancel, onReview }: NewSpendingLimitProps): React.ReactElement => (
  <>
    <TitleSection>
      <Title size="xs" withoutMargin>
        New Spending Limit{' '}
        <Text size="lg" color="secondaryLight">
          1 of 2
        </Text>
      </Title>

      <StyledButton onClick={onCancel}>
        <Icon size="sm" type="cross" />
      </StyledButton>
    </TitleSection>

    <GnoForm formMutators={formMutators} onSubmit={onReview} initialValues={initialValues}>
      {(...args) => (
        <>
          <FormContainer>
            <BeneficiarySelect />
            <TokenSelect />
            <Amount />
            <ResetTime />
          </FormContainer>

          <FooterSection>
            <FooterWrapper>
              <Button color="primary" size="md" onClick={onCancel}>
                Cancel
              </Button>

              {/* TODO: replace this with safe-react-components button. This is used as "submit" SRC Button does not triggers submission up until the 2nd click */}
              <YetAnotherButton
                color="primary"
                size="medium"
                variant="contained"
                type="submit"
                disabled={!canReview(args[2])}
              >
                Review
              </YetAnotherButton>
            </FooterWrapper>
          </FooterSection>
        </>
      )}
    </GnoForm>
  </>
)

export default NewSpendingLimit
