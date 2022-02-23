import { ReactElement, useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import Heading from 'src/components/layout/Heading'
import { history } from 'src/routes/routes'
import { secondary, sm } from 'src/theme/variables'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import NameNewSafeStep, { nameNewSafeStepLabel } from './steps/NameNewSafeStep'
import {
  CreateSafeFormValues,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_MAX_OWNER_NUMBER,
  FIELD_NEW_SAFE_PROXY_SALT,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNER_ENS_LIST,
  FIELD_SAFE_OWNERS_LIST,
  SAFE_PENDING_CREATION_STORAGE_KEY,
} from './fields/createSafeFields'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { providerNameSelector, shouldSwitchWalletChain, userAccountSelector } from 'src/logic/wallets/store/selectors'
import OwnersAndConfirmationsNewSafeStep, {
  ownersAndConfirmationsNewSafeStepLabel,
} from './steps/OwnersAndConfirmationsNewSafeStep'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import ReviewNewSafeStep, { reviewNewSafeStepLabel } from './steps/ReviewNewSafeStep'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import SafeCreationProcess from './components/SafeCreationProcess'
import SelectWalletAndNetworkStep, { selectWalletAndNetworkStepLabel } from './steps/SelectWalletAndNetworkStep'
import { reverseENSLookup } from 'src/logic/wallets/getWeb3'

function CreateSafePage(): ReactElement {
  const [safePendingToBeCreated, setSafePendingToBeCreated] = useState<CreateSafeFormValues>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const providerName = useSelector(providerNameSelector)
  const isWrongNetwork = useSelector(shouldSwitchWalletChain)
  const provider = !!providerName && !isWrongNetwork

  useEffect(() => {
    const checkIfSafeIsPendingToBeCreated = async (): Promise<void> => {
      setIsLoading(true)

      // Removing the await completely is breaking the tests for a mysterious reason
      // @TODO: remove the promise
      const safePendingToBeCreated = await Promise.resolve(
        loadFromStorage<CreateSafeFormValues>(SAFE_PENDING_CREATION_STORAGE_KEY),
      )

      if (provider) {
        setSafePendingToBeCreated(safePendingToBeCreated)
      }
      setIsLoading(false)
    }
    checkIfSafeIsPendingToBeCreated()
  }, [provider])

  const userWalletAddress = useSelector(userAccountSelector)
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const location = useLocation()
  const safeRandomName = useMnemonicSafeName()

  const showSafeCreationProcess = (newSafeFormValues: CreateSafeFormValues): void => {
    saveToStorage(SAFE_PENDING_CREATION_STORAGE_KEY, { ...newSafeFormValues })
    setSafePendingToBeCreated(newSafeFormValues)
  }

  const [initialFormValues, setInitialFormValues] = useState<CreateSafeFormValues>()

  useEffect(() => {
    let isCurrent = true
    if (provider && userWalletAddress) {
      const getInitValues = async () => {
        const initialValuesFromUrl = await getInitialValues(userWalletAddress, addressBook, location, safeRandomName)
        if (isCurrent) {
          setInitialFormValues(initialValuesFromUrl)
        }
      }
      getInitValues()
    }
    return () => {
      isCurrent = false
    }
  }, [provider, userWalletAddress, addressBook, location, safeRandomName])

  if (isLoading) {
    return (
      <LoaderContainer data-testid={'create-safe-loader'}>
        <Loader size="md" />
      </LoaderContainer>
    )
  }

  const isInitializing = !provider || !initialFormValues

  return !!safePendingToBeCreated ? (
    <SafeCreationProcess />
  ) : (
    <Page>
      <Block>
        <Row align="center">
          <BackIcon disableRipple onClick={history.goBack}>
            <ChevronLeft />
          </BackIcon>
          <Heading tag="h2">Create new Safe</Heading>
        </Row>
        <StepperForm initialValues={initialFormValues} onSubmit={showSafeCreationProcess} testId={'create-safe-form'}>
          <StepFormElement
            label={selectWalletAndNetworkStepLabel}
            nextButtonLabel="Continue"
            disableNextButton={isInitializing}
          >
            <SelectWalletAndNetworkStep />
          </StepFormElement>
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue">
            <NameNewSafeStep />
          </StepFormElement>
          <StepFormElement label={ownersAndConfirmationsNewSafeStepLabel} nextButtonLabel="Continue">
            <OwnersAndConfirmationsNewSafeStep />
          </StepFormElement>
          <StepFormElement label={reviewNewSafeStepLabel} nextButtonLabel="Create">
            <ReviewNewSafeStep />
          </StepFormElement>
        </StepperForm>
      </Block>
    </Page>
  )
}

export default CreateSafePage

const DEFAULT_THRESHOLD_VALUE = 1

// initial values can be present in the URL because the Old MultiSig migration
async function getInitialValues(userAddress, addressBook, location, suggestedSafeName): Promise<CreateSafeFormValues> {
  const query = queryString.parse(location.search, { arrayFormat: 'comma' })
  const { name, owneraddresses, ownernames, threshold } = query

  // if owners are not present in the URL we use current user account as default owner
  const isOwnersPresentInTheUrl = !!owneraddresses
  const ownersFromUrl = Array.isArray(owneraddresses) ? owneraddresses : [owneraddresses]
  const owners = isOwnersPresentInTheUrl ? ownersFromUrl : [userAddress]

  // we set the owner names
  const ownersNamesFromUrl = Array.isArray(ownernames) ? ownernames : [ownernames]
  const userAddressName = [addressBook[userAddress]?.name || '']
  const ownerNames = isOwnersPresentInTheUrl ? ownersNamesFromUrl : userAddressName

  const thresholdFromURl = Number(threshold)
  const isValidThresholdInTheUrl =
    threshold && !Number.isNaN(threshold) && thresholdFromURl <= owners.length && thresholdFromURl > 0

  return {
    [FIELD_CREATE_SUGGESTED_SAFE_NAME]: suggestedSafeName,
    [FIELD_CREATE_CUSTOM_SAFE_NAME]: name,
    [FIELD_NEW_SAFE_THRESHOLD]: isValidThresholdInTheUrl ? threshold : DEFAULT_THRESHOLD_VALUE,
    [FIELD_SAFE_OWNERS_LIST]: owners.map((owner, index) => ({
      nameFieldName: `owner-name-${index}`,
      addressFieldName: `owner-address-${index}`,
    })),
    [FIELD_SAFE_OWNER_ENS_LIST]: (
      await Promise.all(
        owners.map(async (address) => {
          return { [address]: await reverseENSLookup(address) }
        }),
      )
    ).reduce((acc, owner) => {
      return { ...acc, ...owner }
    }, {}),
    // we set owners address values as owner-address-${index} format in the form state
    ...owners.reduce(
      (ownerAddressFields, ownerAddress, index) => ({
        ...ownerAddressFields,
        [`owner-address-${index}`]: ownerAddress,
      }),
      {},
    ),
    // we set owners name values as owner-name-${index} format in the form state
    ...ownerNames.reduce(
      (ownerNameFields, ownerName, index) => ({
        ...ownerNameFields,
        [`owner-name-${index}`]: ownerName,
      }),
      {},
    ),
    [FIELD_MAX_OWNER_NUMBER]: owners.length,
    [FIELD_NEW_SAFE_PROXY_SALT]: Date.now(),
  }
}

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const BackIcon = styled(IconButton)`
  color: ${secondary};
  padding: ${sm};
  margin-right: 5px;
`
