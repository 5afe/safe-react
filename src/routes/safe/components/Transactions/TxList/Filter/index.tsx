import { ReactElement, useRef, useState } from 'react'
import { Controller, DefaultValues, useForm } from 'react-hook-form'
import styled from 'styled-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener'
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup'
import Radio from '@material-ui/core/Radio/Radio'
import Paper from '@material-ui/core/Paper/Paper'
import FormControl from '@material-ui/core/FormControl/FormControl'
import FormLabel from '@material-ui/core/FormLabel/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import type { SettingsInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import Button from 'src/components/layout/Button'
import RHFTextField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFTextField'
import RHFAddressSearchField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFAddressSearchField'
import RHFModuleSearchField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFModuleSearchField'
import BackdropLayout from 'src/components/layout/Backdrop'
import filterIcon from 'src/routes/safe/components/Transactions/TxList/assets/filter-icon.svg'

import { lg, md, primary300, grey400, largeFontSize, primary200, sm } from 'src/theme/variables'
import { trackEvent } from 'src/utils/googleTagManager'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'

// Types cannot take computed property names
const TYPE_FIELD_NAME = 'type'
const FROM_FIELD_NAME = 'execution_date__gte'
const TO_FIELD_NAME = 'execution_date__lte'
const RECIPIENT_FIELD_NAME = 'to'
const HIDDEN_RECIPIENT_FIELD_NAME = '__to'
const AMOUNT_FIELD_NAME = 'value'
const TOKEN_ADDRESS_FIELD_NAME = 'token_address'
const HIDDEN_TOKEN_ADDRESS_FIELD_NAME = '__token_address'
const MODULE_FIELD_NAME = 'module'
const NONCE_FIELD_NAME = 'nonce'

enum FilterType {
  INCOMING = 'Incoming',
  MULTISIG = 'Outgoing',
  MODULE = 'Module-based',
}

type FilterForm = {
  [TYPE_FIELD_NAME]: FilterType
  [FROM_FIELD_NAME]: string
  [TO_FIELD_NAME]: string
  [RECIPIENT_FIELD_NAME]: string
  [HIDDEN_RECIPIENT_FIELD_NAME]: string
  [AMOUNT_FIELD_NAME]: string
  [TOKEN_ADDRESS_FIELD_NAME]: string
  [HIDDEN_TOKEN_ADDRESS_FIELD_NAME]: string
  [MODULE_FIELD_NAME]: SettingsInfo['type']
  [NONCE_FIELD_NAME]: string
}

const isValidAmount = (value: FilterForm['value']): string | undefined => {
  if (value && isNaN(Number(value))) {
    return 'Invalid number'
  }
}

const isValidNonce = (value: FilterForm['nonce']): string | undefined => {
  if (value.length === 0) {
    return
  }

  const number = Number(value)
  if (isNaN(number)) {
    return 'Invalid number'
  }
  if (number < 0) {
    return 'Nonce cannot be negative'
  }
}

const getTransactionFilter = ({ execution_date__gte, execution_date__lte, to, value }: FilterForm) => {
  return {
    execution_date__gte: execution_date__gte ? new Date(execution_date__gte).toISOString() : undefined,
    execution_date__lte: execution_date__lte ? new Date(execution_date__lte).toISOString() : undefined,
    to: to || undefined,
    value: value ? Number(value) : undefined,
  }
}

const getIncomingFilter = (filter: FilterForm) => {
  return {
    ...getTransactionFilter(filter),
    token_address: filter.token_address || undefined,
  }
}

const getOutgoingFilter = (filter: FilterForm) => {
  return {
    ...getTransactionFilter(filter),
    nonce: filter.nonce ? Number(filter.nonce) : undefined,
  }
}

const getModuleFilter = ({ module }: FilterForm) => {
  return {
    module,
  }
}

const Filter = (): ReactElement => {
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const hideFilter = () => setShowFilter(false)
  const toggleFilter = () => setShowFilter((prev) => !prev)

  // We cannot rely on the default values in `useForm` because they are updated on unmount
  // meaning that each `reset` does not retain the 'original' default values
  const defaultValues = useRef<DefaultValues<FilterForm>>({
    [TYPE_FIELD_NAME]: FilterType.INCOMING,
    [FROM_FIELD_NAME]: '',
    [TO_FIELD_NAME]: '',
    [RECIPIENT_FIELD_NAME]: '',
    [HIDDEN_RECIPIENT_FIELD_NAME]: '',
    [AMOUNT_FIELD_NAME]: '',
    [TOKEN_ADDRESS_FIELD_NAME]: '',
    [HIDDEN_TOKEN_ADDRESS_FIELD_NAME]: '',
    [MODULE_FIELD_NAME]: undefined,
    [NONCE_FIELD_NAME]: '',
  })

  const methods = useForm<FilterForm>({
    defaultValues: defaultValues.current,
  })
  const { handleSubmit, formState, reset, watch, control } = methods

  const type = watch(TYPE_FIELD_NAME)

  const isClearable = Object.entries(formState.dirtyFields).some(([name, value]) => value && name !== TYPE_FIELD_NAME)
  const clearParameters = () => {
    reset({ ...defaultValues.current, type })
  }

  const onSubmit = (filter: FilterForm) => {
    const params =
      type === FilterType.INCOMING
        ? getIncomingFilter(filter)
        : FilterType.MULTISIG
        ? getOutgoingFilter(filter)
        : getModuleFilter(filter)

    console.log(params)

    trackEvent(TX_LIST_EVENTS.FILTER)
    hideFilter()
  }

  return (
    <>
      <BackdropLayout isOpen={showFilter} />
      <ClickAwayListener onClickAway={hideFilter}>
        <Wrapper>
          <StyledFilterButton onClick={toggleFilter} variant="contained" color="primary" disableElevation>
            <StyledFilterIconImage src={filterIcon} /> Filters{' '}
            {showFilter ? <ExpandLessIcon color="secondary" /> : <ExpandMoreIcon color="secondary" />}
          </StyledFilterButton>
          {showFilter && (
            <StyledPaper elevation={0} variant="outlined">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FilterWrapper>
                  <TxTypeFormControl>
                    <StyledFormLabel>Transaction type</StyledFormLabel>
                    <Controller<FilterForm>
                      name={TYPE_FIELD_NAME}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field}>
                          {Object.values(FilterType).map((value) => (
                            <StyledRadioFormControlLabel value={value} control={<Radio />} label={value} key={value} />
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </TxTypeFormControl>
                  <ParamsFormControl>
                    <StyledFormLabel>Parameters</StyledFormLabel>
                    <ParametersFormWrapper>
                      {type !== FilterType.MODULE && (
                        <>
                          <RHFTextField<FilterForm> name={FROM_FIELD_NAME} label="From" type="date" control={control} />
                          <RHFTextField<FilterForm> name={TO_FIELD_NAME} label="To" type="date" control={control} />
                          <RHFAddressSearchField<FilterForm>
                            name={RECIPIENT_FIELD_NAME}
                            hiddenName={HIDDEN_RECIPIENT_FIELD_NAME}
                            label="Recipient"
                            methods={methods}
                          />
                          <RHFTextField<FilterForm>
                            name={AMOUNT_FIELD_NAME}
                            label="Amount"
                            control={control}
                            rules={{
                              validate: isValidAmount,
                            }}
                          />
                        </>
                      )}
                      {type === FilterType.INCOMING && (
                        <RHFAddressSearchField<FilterForm>
                          name={TOKEN_ADDRESS_FIELD_NAME}
                          hiddenName={HIDDEN_TOKEN_ADDRESS_FIELD_NAME}
                          label="Token address"
                          methods={methods}
                        />
                      )}
                      {type === FilterType.MULTISIG && (
                        <RHFTextField<FilterForm>
                          name={NONCE_FIELD_NAME}
                          label="Nonce"
                          control={control}
                          rules={{
                            validate: isValidNonce,
                          }}
                        />
                      )}
                      {type === FilterType.MODULE && (
                        <RHFModuleSearchField<FilterForm> name={MODULE_FIELD_NAME} label="Module" control={control} />
                      )}
                    </ParametersFormWrapper>
                    <ButtonWrapper>
                      <Button type="submit" variant="contained" disabled={!isClearable} color="primary">
                        Apply
                      </Button>
                      <Button variant="contained" onClick={clearParameters} disabled={!isClearable} color="default">
                        Clear
                      </Button>
                    </ButtonWrapper>
                  </ParamsFormControl>
                </FilterWrapper>
              </form>
            </StyledPaper>
          )}
        </Wrapper>
      </ClickAwayListener>
    </>
  )
}

export default Filter

const StyledFilterButton = styled(Button)`
  &.MuiButton-root {
    align-items: center;
    background-color: ${primary200};
    border: 2px solid ${primary300};
    color: #162d45;
    align-self: flex-end;
    margin-right: ${md};
    margin-top: -51px;
    margin-bottom: ${md};
    &:hover {
      background-color: ${primary200};
    }
  }
`

const StyledFilterIconImage = styled.img`
  margin-right: ${sm};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const TxTypeFormControl = styled(FormControl)`
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
