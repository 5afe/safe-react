import { RadioButtons, Text } from '@gnosis.pm/safe-react-components'
import { BigNumber } from 'bignumber.js'
import React, { ReactElement, useMemo } from 'react'
import { useForm } from 'react-final-form'
import styled from 'styled-components'

import Field from 'src/components/forms/Field'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { Token } from 'src/logic/tokens/store/model/token'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'

// TODO: propose refactor in safe-react-components based on this requirements
const SpendingLimitRadioButtons = styled(RadioButtons)`
  & .MuiRadio-colorPrimary.Mui-checked {
    color: ${({ theme }) => theme.colors.primary};
  }
`

interface SpendingLimitRowProps {
  tokenSpendingLimit: SpendingLimit
  selectedToken: Token
}

export const SpendingLimitRow = ({ tokenSpendingLimit, selectedToken }: SpendingLimitRowProps): ReactElement => {
  const availableAmount = useMemo(() => {
    return fromTokenUnit(
      new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString(),
      selectedToken.decimals,
    )
  }, [selectedToken.decimals, tokenSpendingLimit.amount, tokenSpendingLimit.spent])
  const { mutators } = useForm()

  return (
    <Row margin="sm">
      <Col between="lg" style={{ flexDirection: 'column' }}>
        <Text size="lg">Send as</Text>
        <Field name="txType" initialValue="multiSig">
          {({ input: { name, value } }) => (
            <SpendingLimitRadioButtons
              name={name}
              value={value || 'multiSig'}
              onRadioChange={mutators.setTxType}
              options={[
                { label: 'Multisig transaction', value: 'multiSig' },
                {
                  label: `Spending limit transaction (${availableAmount} ${selectedToken.symbol})`,
                  value: 'spendingLimit',
                },
              ]}
            />
          )}
        </Field>
      </Col>
    </Row>
  )
}
