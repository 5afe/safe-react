import { RadioButtons, Text } from '@gnosis.pm/safe-react-components'
import { FormControlLabel, hexToRgb, Switch as SwitchMui } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { useField } from 'react-final-form'
import styled from 'styled-components'

import { getNetworkName } from 'src/config'
import { Field } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/Amount'

// TODO: propose refactor in safe-react-components based on this requirements
const SpendingLimitRadioButtons = styled(RadioButtons)`
  & .MuiRadio-colorPrimary.Mui-checked {
    color: ${({ theme }) => theme.colors.primary};
  }
`

// TODO: add `name` and `value` to SRC Switch, as they're required for a better RFF integration
const StyledSwitch = styled(({ ...rest }) => <SwitchMui {...rest} />)`
  && {
    .MuiIconButton-label,
    .MuiSwitch-colorSecondary {
      color: ${({ theme }) => theme.colors.icon};
    }

    .MuiSwitch-colorSecondary.Mui-checked .MuiIconButton-label {
      color: ${({ theme }) => theme.colors.primary};
    }

    .MuiSwitch-colorSecondary.Mui-checked:hover {
      background-color: ${({ theme }) => hexToRgb(`${theme.colors.primary}03`)};
    }

    .Mui-checked + .MuiSwitch-track {
      background-color: ${({ theme }) => theme.colors.primaryLight};
    }
  }
`

interface RadioButtonOption {
  label: string
  value: string
}

interface RadioButtonProps {
  options: RadioButtonOption[]
  initialValue: string
  groupName: string
}

const SafeRadioButtons = ({ options, initialValue, groupName }: RadioButtonProps): ReactElement => (
  <Field name={groupName} initialValue={initialValue}>
    {({ input: { name, value, onChange } }) => (
      <SpendingLimitRadioButtons name={name} value={value || initialValue} onRadioChange={onChange} options={options} />
    )}
  </Field>
)

const Switch = ({ label, name }: { label: string; name: string }): ReactElement => (
  <FormControlLabel
    label={label}
    control={
      <Field
        name={name}
        type="checkbox"
        render={({ input: { checked, onChange, name, value } }) => (
          <StyledSwitch checked={checked} onChange={onChange} name={name} value={value} />
        )}
      />
    }
  />
)

const ResetTimeLabel = styled.div`
  grid-area: resetTimeLabel;
`

const ResetTimeToggle = styled.div`
  grid-area: resetTimeToggle;
`

const ResetTimeOptions = styled.div`
  grid-area: resetTimeOption;
`

const RESET_TIME_OPTIONS = [
  { label: '1 day', value: '1440' }, // 1 day x 24h x 60min
  { label: '1 week', value: '10080' }, // 7 days x 24h x 60min
  { label: '1 month', value: '43200' }, // 30 days x 24h x 60min
]

const RINKEBY_RESET_TIME_OPTIONS = [
  { label: '5 minutes', value: '5' },
  { label: '30 minutes', value: '30' },
  { label: '1 hour', value: '60' },
]

export const getResetTimeOptions = (): RadioButtonOption[] => {
  const currentNetwork = getNetworkName().toLowerCase()
  return currentNetwork !== 'rinkeby' ? RESET_TIME_OPTIONS : RINKEBY_RESET_TIME_OPTIONS
}

const ResetTime = (): ReactElement => {
  const {
    input: { value: withResetTime },
  } = useField('withResetTime', { subscription: { value: true } })

  const resetTimeOptions = getResetTimeOptions()

  const switchExplanation = withResetTime ? 'choose reset time period' : 'one time'

  return (
    <>
      <ResetTimeLabel>
        <Text size="xl">Set a reset time so the allowance automatically refills after the defined time period.</Text>
      </ResetTimeLabel>
      <ResetTimeToggle>
        <Switch label={`Reset time (${switchExplanation})`} name="withResetTime" />
      </ResetTimeToggle>
      {withResetTime && (
        <ResetTimeOptions>
          <SafeRadioButtons groupName="resetTime" initialValue={resetTimeOptions[0].value} options={resetTimeOptions} />
        </ResetTimeOptions>
      )}
    </>
  )
}

export default ResetTime
