import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup'
import Radio from '@material-ui/core/Radio/Radio'
import Paper from '@material-ui/core/Paper/Paper'
import FormControl from '@material-ui/core/FormControl/FormControl'
import FormLabel from '@material-ui/core/FormLabel/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'

import Button from 'src/components/layout/Button'
import RHFTextField from 'src/components/forms/RHF/RHFTextField'

import { lg, md, primary300, grey400, largeFontSize } from 'src/theme/variables'

enum FilterType {
  INCOMING = 'Incoming',
  MODULE = 'Module',
  MULTISIG = 'Multisignature',
}
enum Module {
  EXAMPLE = 'Example',
}
type FilterForm = {
  type: FilterType
  from: number
  to: number
  recipient: string
  amount: number
  tokenAddress: string
  module: Module
  nonce: number
}

const HistoryFilter = () => {
  const { handleSubmit, formState, control, reset, watch } = useForm<FilterForm>({
    defaultValues: {
      type: FilterType.INCOMING,
      from: undefined,
      to: undefined,
      recipient: undefined,
      amount: undefined,
      tokenAddress: undefined,
      module: undefined,
      nonce: undefined,
    },
    shouldUnregister: true, // Remove values of unmounted inputs
  })

  const type = watch('type')

  const isClearable = formState.isDirty && !formState.dirtyFields.type

  const onClear = () => {
    reset({ type })
  }

  const onSubmit = ({ type: _, ...filter }: FilterForm) => {
    console.log(filter)
  }

  return (
    <Wrapper>
      <StyledPaper elevation={0} variant="outlined">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FilterWrapper>
            <StyledTxTypeFormControl>
              <StyledFormLabel>Transaction type</StyledFormLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {Object.values(FilterType).map((value) => (
                      <StyledRadioFormControlLabel value={value} control={<Radio />} label={value} key={value} />
                    ))}
                  </RadioGroup>
                )}
              />
            </StyledTxTypeFormControl>
            <ParamsFormControl>
              <StyledFormLabel>Parameters</StyledFormLabel>
              <ParametersFormWrapper>
                <RHFTextField name="from" control={control} label="From" />
                <RHFTextField name="to" control={control} label="To" />
                <RHFTextField name="recipient" control={control} label="Recipient" />
                {[FilterType.INCOMING, FilterType.MULTISIG].includes(type) && (
                  <>
                    <RHFTextField name="amount" control={control} label="Amount" />
                    {type === FilterType.INCOMING && (
                      <RHFTextField name="tokenAddress" control={control} label="Token Address" />
                    )}
                    {type === FilterType.MULTISIG && <RHFTextField name="nonce" control={control} label="Nonce" />}
                  </>
                )}
                {type === FilterType.MODULE && <RHFTextField name="module" control={control} label="Module" />}
              </ParametersFormWrapper>
              <ButtonWrapper>
                <Button type="submit" variant="contained" disabled={!isClearable} color="primary">
                  Apply
                </Button>
                <Button variant="contained" onClick={onClear} disabled={!isClearable} color="gray">
                  Clear
                </Button>
              </ButtonWrapper>
            </ParamsFormControl>
          </FilterWrapper>
        </form>
      </StyledPaper>
    </Wrapper>
  )
}

export default HistoryFilter

const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  width: 100%;
`

const StyledPaper = styled(Paper)`
  border: 2px solid ${primary300};
  position: absolute;
  width: calc(100% - 30px);
  margin-left: 10px;
  top: 0;
  left: 0;
`

const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: ${lg};
`

const StyledTxTypeFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    box-sizing: border-box;
    padding: ${lg};
    border-right: 2px solid ${grey400}; // Divider
  }
`

const StyledFormLabel = styled(FormLabel)`
  &.MuiFormLabel-root {
    margin-bottom: ${lg};
    font-size: 12px;
    color: #b2bbc0;
  }
`

const StyledRadioFormControlLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-root {
    font-size: ${largeFontSize};
  }
`

const ParamsFormControl = styled(FormControl)`
  &.MuiFormControl-root {
    box-sizing: border-box;
    padding: ${lg} 128px ${lg} ${lg};
  }
`

const ParametersFormWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
`

const ButtonWrapper = styled.div`
  grid-column: span 2;
  margin-top: 36px;
  display: grid;
  grid-template-columns: 100px 100px;
  gap: ${md};
`
