import { ReactElement, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import Block from 'src/components/layout/Block'
import Page from 'src/components/layout/Page'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
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
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSafeLoad } from 'src/logic/addressBook/store/actions'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { loadStoredSafes, saveSafes } from 'src/logic/safe/utils'
import { addOrUpdateSafe } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import {
  FIELD_LOAD_IS_LOADING_SAFE_ADDRESS,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNER_ENS_LIST,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
  LoadSafeFormValues,
} from './fields/loadFields'
import { extractPrefixedSafeAddress, generateSafeRoute, LOAD_SPECIFIC_SAFE_ROUTE, SAFE_ROUTES } from '../routes'
import { getShortName } from 'src/config'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { getLoadSafeName, getOwnerName } from './fields/utils'
import { currentChainId } from 'src/logic/config/store/selectors'
import { LOAD_SAFE_CATEGORY, LOAD_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'
import { trackEvent } from 'src/utils/googleTagManager'

function Load(): ReactElement {
  const dispatch = useDispatch()
  const history = useHistory()
  const { safeAddress, shortName } = extractPrefixedSafeAddress(undefined, LOAD_SPECIFIC_SAFE_ROUTE)
  const safeRandomName = useMnemonicSafeName()
  const [initialFormValues, setInitialFormValues] = useState<LoadSafeFormValues>()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    const initialValues: LoadSafeFormValues = {
      [FIELD_LOAD_SUGGESTED_SAFE_NAME]: safeRandomName,
      [FIELD_LOAD_SAFE_ADDRESS]: safeAddress,
      [FIELD_LOAD_IS_LOADING_SAFE_ADDRESS]: false,
      [FIELD_SAFE_OWNER_LIST]: [],
      [FIELD_SAFE_OWNER_ENS_LIST]: {},
    }
    setInitialFormValues(initialValues)
  }, [safeAddress, safeRandomName])

  const updateAddressBook = (values: LoadSafeFormValues) => {
    const ownerList = values[FIELD_SAFE_OWNER_LIST] as AddressBookEntry[]

    const ownerEntries = ownerList
      .map((owner) => {
        const ownerName = getOwnerName(values, owner.address)
        return {
          ...owner,
          name: ownerName,
        }
      })
      .filter((owner) => !!owner.name)

    const safeEntry = makeAddressBookEntry({
      address: checksumAddress(values[FIELD_LOAD_SAFE_ADDRESS] || ''),
      name: getLoadSafeName(values, addressBook),
      chainId,
    })

    dispatch(addressBookSafeLoad([...ownerEntries, safeEntry]))
  }

  const onSubmitLoadSafe = async (values: LoadSafeFormValues): Promise<void> => {
    const address = values[FIELD_LOAD_SAFE_ADDRESS]
    if (!isValidAddress(address)) {
      return
    }

    // Track number of owners
    trackEvent({
      ...LOAD_SAFE_EVENTS.OWNERS,
      label: values[FIELD_SAFE_OWNER_LIST].length,
    })

    const threshold = values[FIELD_SAFE_THRESHOLD]
    if (threshold) {
      // Track threshold
      trackEvent({
        ...LOAD_SAFE_EVENTS.THRESHOLD,
        label: threshold,
      })
    }

    trackEvent(LOAD_SAFE_EVENTS.GO_TO_SAFE)

    updateAddressBook(values)

    const checksummedAddress = checksumAddress(address || '')
    const safeProps = await buildSafe(checksummedAddress)
    const storedSafes = loadStoredSafes() || {}
    storedSafes[checksummedAddress] = safeProps

    saveSafes(storedSafes)
    dispatch(addOrUpdateSafe(safeProps))

    // Go to the newly added Safe
    history.push(
      generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
        shortName: getShortName(),
        safeAddress: checksummedAddress,
      }),
    )
  }

  return (
    <Page>
      <Block>
        <Row align="center">
          <BackIcon disableRipple onClick={history.goBack}>
            <ChevronLeft />
          </BackIcon>
          <Heading tag="h2">Add existing Safe</Heading>
        </Row>

        {/* key={safeAddress} ensures that it goes to step 1 when the address changes */}
        <StepperForm
          initialValues={initialFormValues}
          testId="load-safe-form"
          onSubmit={onSubmitLoadSafe}
          key={safeAddress}
          trackingCategory={LOAD_SAFE_CATEGORY}
        >
          {safeAddress && shortName ? null : (
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
