import { ReactElement, useEffect, useState } from 'react'
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
import { parse } from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'src/components/layout/Button'
import RHFTextField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFTextField'
import RHFAddressSearchField from 'src/routes/safe/components/Transactions/TxList/Filter/RHFAddressSearchField'
import BackdropLayout from 'src/components/layout/Backdrop'
import filterIcon from 'src/routes/safe/components/Transactions/TxList/assets/filter-icon.svg'
import { lg, md, primary300, grey400, largeFontSize, primary200, sm, black300, fontColor } from 'src/theme/variables'
import { trackEvent } from 'src/utils/googleTagManager'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'
import { isValidAmount, isValidNonce } from 'src/routes/safe/components/Transactions/TxList/Filter/validation'
import { currentChainId } from 'src/logic/config/store/selectors'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import {
  addHistoryTransactions,
  removeHistoryTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { loadHistoryTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { checksumAddress } from 'src/utils/checksumAddress'
import { ChainId } from 'src/config/chain'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { isEqual } from 'lodash'
import { red } from '@material-ui/core/colors'

export const FILTER_TYPE_FIELD_NAME = 'type'
export const DATE_FROM_FIELD_NAME = 'execution_date__gte'
export const DATE_TO_FIELD_NAME = 'execution_date__lte'
export const RECIPIENT_FIELD_NAME = 'to'
export const AMOUNT_FIELD_NAME = 'value'
export const TOKEN_ADDRESS_FIELD_NAME = 'token_address'
export const MODULE_FIELD_NAME = 'module'
export const NONCE_FIELD_NAME = 'nonce'

export enum FilterType {
  INCOMING = 'Incoming',
  MULTISIG = 'Outgoing',
  MODULE = 'Module-based',
}

// Types cannot take computed property names
export type FilterForm = {
  [FILTER_TYPE_FIELD_NAME]: FilterType
  [DATE_FROM_FIELD_NAME]: string
  [DATE_TO_FIELD_NAME]: string
  [RECIPIENT_FIELD_NAME]: string
  [AMOUNT_FIELD_NAME]: string
  [TOKEN_ADDRESS_FIELD_NAME]: string
  [MODULE_FIELD_NAME]: string
  [NONCE_FIELD_NAME]: string
}

const defaultValues: DefaultValues<FilterForm> = {
  [FILTER_TYPE_FIELD_NAME]: FilterType.INCOMING,
  [DATE_FROM_FIELD_NAME]: '',
  [DATE_TO_FIELD_NAME]: '',
  [RECIPIENT_FIELD_NAME]: '',
  [AMOUNT_FIELD_NAME]: '',
  [TOKEN_ADDRESS_FIELD_NAME]: '',
  [MODULE_FIELD_NAME]: '',
  [NONCE_FIELD_NAME]: '',
}

const getInitialValues = (search: string): DefaultValues<FilterForm> => {
  return {
    ...defaultValues,
    ...parse(search),
  }
}

const loadTransactions = ({
  chainId,
  safeAddress,
  filter,
}: {
  chainId: ChainId
  safeAddress: string
  filter?: FilterForm
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(removeHistoryTransactions({ chainId, safeAddress }))

    try {
      const values = await loadHistoryTransactions(safeAddress, filter)
      dispatch(addHistoryTransactions({ chainId, safeAddress, values }))
    } catch (e) {
      e.log()
    }
  }
}

const StyledRHFTextField = styled(RHFTextField)`
  &:hover {
    .MuiOutlinedInput-notchedOutline {
      border-color: ${black300};
    }
  }
`

const Filter = (): ReactElement => {
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)
  const { safeAddress } = useSafeAddress()
  const { pathname, search } = useLocation()
  const history = useHistory()

  const [showFilter, setShowFilter] = useState<boolean>(false)
  const hideFilter = () => setShowFilter(false)

  const initialValues = getInitialValues(search)

  const methods = useForm<FilterForm>({
    defaultValues: initialValues,
    shouldUnregister: true,
  })
  const { handleSubmit, reset, watch, control, getValues } = methods

  const toggleFilter = () => {
    if (showFilter) {
      setShowFilter(false)
      return
    }
    setShowFilter(true)

    // We use `shouldUnregister` to avoid saving every value to search
    // We must therefore reset the form to the values from it
    Object.entries(initialValues).forEach(([key, value]) => {
      methods.setValue(key as keyof FilterForm, value)
    })
  }

  const clearFilter = () => {
    history.replace({ search: '' })
    dispatch(loadTransactions({ chainId, safeAddress: checksumAddress(safeAddress) }))
    reset(defaultValues)
    hideFilter()
  }

  const filterType = watch(FILTER_TYPE_FIELD_NAME)

  useEffect(() => {
    // We cannot rely on cleanup as setting search params (in onSubmit) unmounts the component
    const unsubscribe = history.listen((newLocation) => {
      const shouldResetHistory = filterType && newLocation.pathname !== pathname
      if (shouldResetHistory) {
        dispatch(loadTransactions({ chainId, safeAddress: checksumAddress(safeAddress) }))
      }
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (filter: FilterForm) => {
    // Don't apply the same filter twice
    if (isEqual(filter, initialValues)) {
      hideFilter()
    }

    const query = Object.fromEntries(Object.entries(filter).filter(([, value]) => !!value))

    history.replace({ search: `?${new URLSearchParams(query).toString()}` })

    dispatch(loadTransactions({ chainId, safeAddress: checksumAddress(safeAddress), filter }))

    const trackedFields = [
      FILTER_TYPE_FIELD_NAME,
      DATE_FROM_FIELD_NAME,
      DATE_TO_FIELD_NAME,
      RECIPIENT_FIELD_NAME,
      AMOUNT_FIELD_NAME,
      TOKEN_ADDRESS_FIELD_NAME,
      MODULE_FIELD_NAME,
      NONCE_FIELD_NAME,
    ]

    trackedFields.forEach((field) => {
      if (query[field]) {
        trackEvent({ ...TX_LIST_EVENTS.FILTER, label: query[field] })
      }
    })

    hideFilter()
  }

  return (
    <>
      <BackdropLayout isOpen={showFilter} />
      <ClickAwayListener onClickAway={hideFilter}>
        <Wrapper>
          <StyledFilterButton onClick={toggleFilter} variant="contained" disableElevation $isFiltered={!!search}>
            <StyledFilterIconImage src={filterIcon} /> {search ? initialValues[FILTER_TYPE_FIELD_NAME] : 'Filter'}
            {showFilter ? <ExpandLessIcon color="secondary" /> : <ExpandMoreIcon color="secondary" />}
          </StyledFilterButton>
          {showFilter && (
            <StyledPaper elevation={0} variant="outlined">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FilterWrapper>
                  <TxTypeFormControl>
                    <StyledFormLabel>Transaction type</StyledFormLabel>
                    <Controller<FilterForm>
                      name={FILTER_TYPE_FIELD_NAME}
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
                          {/* @ts-expect-error - styled-components don't have strict types */}
                          <StyledRHFTextField<FilterForm>
                            name={DATE_FROM_FIELD_NAME}
                            label="From"
                            type="date"
                            control={control}
                            rules={{
                              validate: (value) => {
                                const to = getValues(DATE_TO_FIELD_NAME)
                                if (value && to && value > to) {
                                  return 'Cannot be after to date'
                                }
                              },
                            }}
                          />
                          {/* @ts-expect-error - styled-components don't have strict types */}
                          <StyledRHFTextField<FilterForm>
                            name={DATE_TO_FIELD_NAME}
                            label="To"
                            type="date"
                            control={control}
                            rules={{
                              validate: (value) => {
                                const from = getValues(DATE_FROM_FIELD_NAME)
                                if (value && from && value < from) {
                                  console.log('invalid')
                                  return 'Cannot be before from date'
                                }
                              },
                            }}
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
                          label="Token address"
                          methods={methods}
                        />
                      )}
                      {filterType === FilterType.MULTISIG && (
                        <>
                          <RHFAddressSearchField<FilterForm>
                            name={RECIPIENT_FIELD_NAME}
                            label="Recipient"
                            methods={methods}
                          />
                          <RHFTextField<FilterForm>
                            name={NONCE_FIELD_NAME}
                            label="Nonce"
                            control={control}
                            rules={{
                              validate: isValidNonce,
                            }}
                          />
                        </>
                      )}
                      {filterType === FilterType.MODULE && (
                        <RHFAddressSearchField<FilterForm> name={MODULE_FIELD_NAME} label="Module" methods={methods} />
                      )}
                    </ParametersFormWrapper>
                    <ButtonWrapper>
                      <Button type="submit" variant="contained" color="primary">
                        Apply
                      </Button>
                      <Button variant="contained" onClick={clearFilter} color="primary" disabled={!search}>
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

const StyledFilterButton = styled(Button)<{ $isFiltered: boolean }>`
  &.MuiButton-root {
    align-items: center;
    background-color: ${({ $isFiltered }) => ($isFiltered ? primary200 : 'transparent')};

    align-self: flex-end;
    margin-right: ${md};
    margin-top: -51px;
    margin-bottom: ${md};

      span {
        color: #06fc99;
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
  border: 2px solid #06fc99;
  background-color: black; 
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
    color: #06fc99;
  }
`

const StyledRadioFormControlLabel = styled(FormControlLabel)`
  color: #06fc99;
  .MuiFormControlLabel-root {
    font-size: ${largeFontSize};
    color: #06fc99;
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
