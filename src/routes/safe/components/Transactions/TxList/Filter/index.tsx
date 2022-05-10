import { ReactElement, useState } from 'react'
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
import { parse, ParsedQuery, stringify } from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'src/components/layout/Button'
import RHFTextField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFTextField'
import RHFAddressSearchField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFAddressSearchField'
import BackdropLayout from 'src/components/layout/Backdrop'
import filterIcon from 'src/routes/safe/components/Transactions/TxList/assets/filter-icon.svg'
import { lg, md, primary300, grey400, largeFontSize, primary200, sm } from 'src/theme/variables'
import { trackEvent } from 'src/utils/googleTagManager'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'
import { formateDate } from 'src/utils/date'
import {
  getIncomingFilter,
  getModuleFilter,
  getOutgoingFilter,
} from 'src/routes/safe/components/Transactions/TxList/Filter/utils'
import { isValidAmount, isValidNonce } from 'src/routes/safe/components/Transactions/TxList/Filter/validation'
import { currentChainId } from 'src/logic/config/store/selectors'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'

const TYPE_FIELD_NAME = 'type'
const DATE_FROM_FIELD_NAME = 'execution_date__gte'
const DATE_TO_FIELD_NAME = 'execution_date__lte'
const RECIPIENT_FIELD_NAME = 'to'
const AMOUNT_FIELD_NAME = 'value'
const TOKEN_ADDRESS_FIELD_NAME = 'token_address'
const MODULE_FIELD_NAME = 'module'
const NONCE_FIELD_NAME = 'nonce'
// We use 'hidden' fields for the ENS domain/address book name
const HIDDEN_RECIPIENT_FIELD_NAME = '__to'
const HIDDEN_TOKEN_ADDRESS_FIELD_NAME = '__token_address'
const HIDDEN_MODULE_FIELD_NAME = '__module'

export enum FilterType {
  INCOMING = 'Incoming',
  MULTISIG = 'Outgoing',
  MODULE = 'Module-based',
}

// Types cannot take computed property names
export type FilterForm = {
  [TYPE_FIELD_NAME]: FilterType
  [DATE_FROM_FIELD_NAME]: string
  [DATE_TO_FIELD_NAME]: string
  [RECIPIENT_FIELD_NAME]: string
  [HIDDEN_RECIPIENT_FIELD_NAME]: string
  [AMOUNT_FIELD_NAME]: string
  [TOKEN_ADDRESS_FIELD_NAME]: string
  [HIDDEN_TOKEN_ADDRESS_FIELD_NAME]: string
  [MODULE_FIELD_NAME]: string
  [HIDDEN_MODULE_FIELD_NAME]: string
  [NONCE_FIELD_NAME]: string
}

const defaultValues: DefaultValues<FilterForm> = {
  [TYPE_FIELD_NAME]: FilterType.INCOMING,
  [DATE_FROM_FIELD_NAME]: '',
  [DATE_TO_FIELD_NAME]: '',
  [RECIPIENT_FIELD_NAME]: '',
  [HIDDEN_RECIPIENT_FIELD_NAME]: '',
  [AMOUNT_FIELD_NAME]: '',
  [TOKEN_ADDRESS_FIELD_NAME]: '',
  [HIDDEN_TOKEN_ADDRESS_FIELD_NAME]: '',
  [MODULE_FIELD_NAME]: '',
  [NONCE_FIELD_NAME]: '',
}

const getInitialValues = (search: string) => {
  const parsedSearch = parse(search)

  const timestampToISO = (value: ParsedQuery[string]): string => {
    const timestamp = Number(value)
    return !isNaN(timestamp) ? formateDate(timestamp) : ''
  }

  return {
    ...defaultValues,
    ...parsedSearch,
    ...(parsedSearch[DATE_FROM_FIELD_NAME] && {
      [DATE_FROM_FIELD_NAME]: timestampToISO(parsedSearch[DATE_FROM_FIELD_NAME]),
    }),
    ...(parsedSearch[DATE_TO_FIELD_NAME] && {
      [DATE_TO_FIELD_NAME]: timestampToISO(parsedSearch[DATE_TO_FIELD_NAME]),
    }),
  }
}

const Filter = (): ReactElement => {
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)
  const history = useHistory()
  const { pathname, search } = useLocation()
  const { safeAddress } = useSafeAddress()

  const [showFilter, setShowFilter] = useState<boolean>(false)
  const hideFilter = () => setShowFilter(false)
  const toggleFilter = () => setShowFilter((prev) => !prev)

  const setSearchParams = (params?: Record<string, unknown>) => {
    history.replace(params ? `${pathname}?${stringify(params)}` : pathname)
  }

  const methods = useForm<FilterForm>({
    defaultValues: getInitialValues(search),
    shouldUnregister: true,
  })
  const { handleSubmit, reset, watch, control, formState } = methods

  const isClearable = !search && !formState.isDirty

  const clearFilter = () => {
    setSearchParams()

    dispatch(fetchTransactions(chainId, safeAddress))

    reset(defaultValues)
    hideFilter()
  }

  const filterType = watch(TYPE_FIELD_NAME)

  const onSubmit = (filter: FilterForm) => {
    const params =
      filterType === FilterType.INCOMING
        ? getIncomingFilter(filter)
        : FilterType.MULTISIG
        ? getOutgoingFilter(filter)
        : getModuleFilter(filter)

    setSearchParams(params)

    dispatch(fetchTransactions(chainId, safeAddress))

    trackEvent(TX_LIST_EVENTS.FILTER)
    hideFilter()
  }

  return (
    <>
      <BackdropLayout isOpen={showFilter} />
      <ClickAwayListener onClickAway={hideFilter}>
        <Wrapper>
          {search && <button onClick={clearFilter}>Clear filter</button>}
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
                      {filterType !== FilterType.MODULE && (
                        <>
                          <RHFTextField<FilterForm>
                            name={DATE_FROM_FIELD_NAME}
                            label="From"
                            type="date"
                            control={control}
                          />
                          <RHFTextField<FilterForm>
                            name={DATE_TO_FIELD_NAME}
                            label="To"
                            type="date"
                            control={control}
                          />
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
                      {filterType === FilterType.INCOMING && (
                        <RHFAddressSearchField<FilterForm>
                          name={TOKEN_ADDRESS_FIELD_NAME}
                          hiddenName={HIDDEN_TOKEN_ADDRESS_FIELD_NAME}
                          label="Token address"
                          methods={methods}
                        />
                      )}
                      {filterType === FilterType.MULTISIG && (
                        <RHFTextField<FilterForm>
                          name={NONCE_FIELD_NAME}
                          label="Nonce"
                          control={control}
                          rules={{
                            validate: isValidNonce,
                          }}
                        />
                      )}
                      {filterType === FilterType.MODULE && (
                        <RHFAddressSearchField<FilterForm>
                          name={MODULE_FIELD_NAME}
                          hiddenName={HIDDEN_MODULE_FIELD_NAME}
                          label="Module"
                          methods={methods}
                        />
                      )}
                    </ParametersFormWrapper>
                    <ButtonWrapper>
                      <Button type="submit" variant="contained" color="primary">
                        Apply
                      </Button>
                      <Button variant="contained" onClick={clearFilter} color="default" disabled={isClearable}>
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
