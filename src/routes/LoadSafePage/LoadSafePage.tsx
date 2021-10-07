import { ReactElement, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { secondary, sm } from 'src/theme/variables'
import SelectNetworkStep, { selectNetworkStepLabel } from './steps/SelectNetworkStep'
import LoadSafeAddressStep, {
  loadSafeAddressStepLabel,
  loadSafeAddressStepValidations,
} from './steps/LoadSafeAddressStep'
import LoadSafeOwnersStep, { loadSafeOwnersStepLabel } from './steps/LoadSafeOwnersStep'
import ReviewLoadStep, { reviewLoadStepLabel } from './steps/ReviewLoadStep'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import { isValidAddress } from 'src/utils/isValidAddress'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_IS_LOADING_SAFE_ADDRESS,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNER_LIST,
  LoadSafeFormValues,
} from './fields/loadFields'
import { IS_PRODUCTION } from 'src/utils/constants'
import { extractPrefixedSafeAddress, generateSafeRoute, LOAD_SPECIFIC_SAFE_ROUTE, SAFE_ROUTES } from '../routes'
import { getCurrentShortChainName } from 'src/config'

function Load(): ReactElement {
  const provider = useSelector(providerNameSelector)

  const dispatch = useDispatch()
  const history = useHistory()

  const { safeAddress } = extractPrefixedSafeAddress(LOAD_SPECIFIC_SAFE_ROUTE)

  const safeRandomName = useMnemonicSafeName()

  const [initialFormValues, setInitialFormValues] = useState<LoadSafeFormValues>()

  useEffect(() => {
    const initialValues = {
      [FIELD_LOAD_SUGGESTED_SAFE_NAME]: safeRandomName,
      [FIELD_LOAD_SAFE_ADDRESS]: safeAddress,
      [FIELD_LOAD_IS_LOADING_SAFE_ADDRESS]: false,
      [FIELD_SAFE_OWNER_LIST]: [],
    }
    setInitialFormValues(initialValues)
  }, [safeAddress, safeRandomName])

  const onSubmitLoadSafe = async (values) => {
    const safeName = values[FIELD_LOAD_CUSTOM_SAFE_NAME] || values[FIELD_LOAD_SUGGESTED_SAFE_NAME]
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
      name: safeName,
    })
    dispatch(addressBookSafeLoad([...ownerListWithNames, safeAddressBook]))

    const checksumSafeAddress = checksumAddress(safeAddress)
    const safeProps = await buildSafe(checksumSafeAddress)
    const storedSafes = (await loadStoredSafes()) || {}
    storedSafes[checksumSafeAddress] = safeProps
    await saveSafes(storedSafes)
    dispatch(addOrUpdateSafe(safeProps))
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { shortName: getCurrentShortChainName(), safeAddress }))
  }

  return IS_PRODUCTION && !provider ? (
    <div>No account detected</div>
  ) : (
    <Page>
      <Block>
        <Row align="center">
          <BackIcon disableRipple onClick={history.goBack}>
            <ChevronLeft />
          </BackIcon>
          <Heading tag="h2">Add existing Safe</Heading>
        </Row>
        <StepperForm initialValues={initialFormValues} testId={'load-safe-form'} onSubmit={onSubmitLoadSafe}>
          {!IS_PRODUCTION && (
            <StepFormElement label={selectNetworkStepLabel} nextButtonLabel="Continue">
              <SelectNetworkStep />
            </StepFormElement>
          )}
          <StepFormElement label={loadSafeAddressStepLabel} validate={loadSafeAddressStepValidations}>
            <LoadSafeAddressStep />
          </StepFormElement>
          <StepFormElement label={loadSafeOwnersStepLabel} nextButtonLabel="Continue">
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

const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`
