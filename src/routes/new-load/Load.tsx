import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'

import { useDispatch, useSelector } from 'react-redux'
import { generatePath, useParams } from 'react-router-dom'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { history } from 'src/store'
import { sm } from 'src/theme/variables'
import LoadSafeAddressStep, {
  loadSafeAddressStepLabel,
  loadSafeAddressStepValidations,
} from './steps/LoadSafeAddressStep'
import LoadSafeOwnersStep, { loadSafeOwnersStepLabel } from './steps/LoadSafeOwnersStep'
import ReviewLoadStep, { reviewLoadStepLabel } from './steps/ReviewLoadStep'
import { getRandomName } from 'src/logic/hooks/useMnemonicName'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import { APP_ENV } from 'src/utils/constants'
import SelectNetworkStep, { selectNetworkStepLabel } from './steps/SelectNetworkStep'
import { isValidAddress } from 'src/utils/isValidAddress'
import { FIELD_LOAD_SAFE_NAME } from '../load/components/fields'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { SAFE_ROUTES } from '../routes'
import { FIELD_LOAD_SAFE_ADDRESS, FIELD_LOAD_SUGGESTED_SAFE_NAME, FIELD_SAFE_OWNER_LIST } from './fields/loadFields'

function Load(): ReactElement {
  const provider = useSelector(providerNameSelector)

  const dispatch = useDispatch()

  const classes = useStyles()

  const { safeAddress } = useParams<{ safeAddress?: string }>()

  const initialValues = {
    [FIELD_LOAD_SUGGESTED_SAFE_NAME]: getRandomName('safe'),
    [FIELD_LOAD_SAFE_ADDRESS]: safeAddress,
    [FIELD_SAFE_OWNER_LIST]: [],
  }

  const onSubmitLoadSafe = async (values) => {
    const safeAddress = values[FIELD_LOAD_SAFE_ADDRESS]
    const ownerList = values[FIELD_SAFE_OWNER_LIST]

    if (!isValidAddress(safeAddress)) {
      return
    }

    const ownerListWithNames = ownerList
      .map((owner) => {
        const ownerFieldName = `owner-address-${owner.address}`
        const ownerNameValue = values[ownerFieldName]
        return {
          ...owner,
          name: ownerNameValue,
        }
      })
      .filter((owner) => !!owner.name)

    const safeAddressBook = makeAddressBookEntry({
      address: safeAddress,
      name: values[FIELD_LOAD_SUGGESTED_SAFE_NAME] || values[FIELD_LOAD_SAFE_NAME],
    })
    dispatch(addressBookSafeLoad([...ownerListWithNames, safeAddressBook]))

    const checksumSafeAddress = checksumAddress(safeAddress)
    const safeProps = await buildSafe(checksumSafeAddress)
    const storedSafes = (await loadStoredSafes()) || {}
    storedSafes[checksumSafeAddress] = safeProps
    await saveSafes(storedSafes)
    await dispatch(addOrUpdateSafe(safeProps))
    history.push(
      generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
        safeAddress,
      }),
    )
  }

  const isProductionEnv = APP_ENV === 'production'

  return isProductionEnv && !provider ? (
    <div>No account detected</div>
  ) : (
    <Page>
      <Block>
        <Row align="center">
          <IconButton disableRipple onClick={history.goBack} className={classes.backIcon}>
            <ChevronLeft />
          </IconButton>
          <Heading tag="h2">Add existing Safe</Heading>
        </Row>
        <StepperForm initialValues={initialValues} testId={'load-safe-form'} onSubmit={onSubmitLoadSafe}>
          {!isProductionEnv && (
            <StepFormElement label={selectNetworkStepLabel} nextButtonLabel="Continue" disableNextButton={!provider}>
              <SelectNetworkStep />
            </StepFormElement>
          )}
          <StepFormElement label={loadSafeAddressStepLabel} validate={loadSafeAddressStepValidations}>
            <LoadSafeAddressStep />
          </StepFormElement>
          <StepFormElement label={loadSafeOwnersStepLabel} nextButtonLabel="Review">
            <LoadSafeOwnersStep />
          </StepFormElement>
          <StepFormElement label={reviewLoadStepLabel} nextButtonLabel="Add">
            <ReviewLoadStep />
          </StepFormElement>
        </StepperForm>
      </Block>
    </Page>
  )
}

export default Load

const useStyles = makeStyles((theme) => ({
  backIcon: {
    color: theme.palette.secondary.main,
    padding: sm,
    marginRight: '5px',
  },
}))
