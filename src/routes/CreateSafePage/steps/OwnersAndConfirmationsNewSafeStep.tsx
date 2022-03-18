import { useEffect, ReactElement, Fragment } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import CheckCircle from '@material-ui/icons/CheckCircle'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import { useForm } from 'react-final-form'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import AddressInput from 'src/components/forms/AddressInput'
import Button from 'src/components/layout/Button'
import Field from 'src/components/forms/Field'
import ButtonHelper from 'src/components/ButtonHelper'
import SelectField from 'src/components/forms/SelectField'
import { useStepper } from 'src/components/Stepper/stepperContext'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { disabled, extraSmallFontSize, lg, sm, xs, md } from 'src/theme/variables'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import TextField from 'src/components/forms/TextField'
import {
  ADDRESS_REPEATED_ERROR,
  composeValidators,
  minMaxLength,
  minValue,
  required,
  THRESHOLD_ERROR,
} from 'src/components/forms/validator'
import {
  FIELD_MAX_OWNER_NUMBER,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNER_ENS_LIST,
  FIELD_SAFE_OWNERS_LIST,
} from '../fields/createSafeFields'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { reverseENSLookup } from 'src/logic/wallets/getWeb3'
import { sameString } from 'src/utils/strings'

export const ownersAndConfirmationsNewSafeStepLabel = 'Owners and Confirmations'

function OwnersAndConfirmationsNewSafeStep(): ReactElement {
  const provider = useSelector(providerNameSelector)
  const { setCurrentStep } = useStepper()

  useEffect(() => {
    if (!provider) {
      setCurrentStep(0)
    }
  }, [provider, setCurrentStep])

  const createSafeForm = useForm()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)

  const createSafeFormValues = createSafeForm.getState().values
  const formErrors = createSafeForm.getState().errors || {}

  const owners = createSafeFormValues[FIELD_SAFE_OWNERS_LIST]
  const ownersWithENSName = createSafeFormValues[FIELD_SAFE_OWNER_ENS_LIST]
  const threshold = createSafeFormValues[FIELD_NEW_SAFE_THRESHOLD]
  const maxOwnerNumber = createSafeFormValues[FIELD_MAX_OWNER_NUMBER]

  function onClickAddNewOwner() {
    const newEmptyOwner = {
      nameFieldName: `owner-name-${maxOwnerNumber}`,
      addressFieldName: `owner-address-${maxOwnerNumber}`,
    }
    createSafeForm.change(FIELD_SAFE_OWNERS_LIST, [...owners, newEmptyOwner])
    const updatedMaxOwnerNumbers = maxOwnerNumber + 1
    createSafeForm.change(FIELD_MAX_OWNER_NUMBER, updatedMaxOwnerNumbers)
  }

  function onClickRemoveOwner({ addressFieldName }) {
    const ownersUpdated = owners.filter((owner) => owner.addressFieldName !== addressFieldName)
    createSafeForm.change(FIELD_SAFE_OWNERS_LIST, ownersUpdated)
    createSafeForm.change(addressFieldName, undefined)

    const updatedMaxOwnerNumbers = maxOwnerNumber - 1
    createSafeForm.change(FIELD_MAX_OWNER_NUMBER, updatedMaxOwnerNumbers)

    const hasToUpdateThreshold = threshold > ownersUpdated.length
    if (hasToUpdateThreshold) {
      createSafeForm.change(FIELD_NEW_SAFE_THRESHOLD, threshold - 1)
    }
  }

  const getENSName = async (address: string): Promise<void> => {
    const ensName = await reverseENSLookup(address)
    createSafeForm.change(FIELD_SAFE_OWNER_ENS_LIST, { ...ownersWithENSName, [address]: ensName })
  }

  const handleScan = async (address: string, closeQrModal: () => void, addressFieldName: string): Promise<void> => {
    const scannedAddress = address.startsWith('ethereum:') ? address.replace('ethereum:', '') : address
    await getENSName(scannedAddress)
    createSafeForm.change(addressFieldName, scannedAddress)
    closeQrModal()
  }

  return (
    <>
      <BlockWithPadding data-testid={'create-safe-owners-confirmation-step'}>
        <ParagraphWithMargin color="primary" noMargin size="lg">
          Your Safe will have one or more owners. We have prefilled the first owner with your connected wallet details,
          but you are free to change this to a different owner.
        </ParagraphWithMargin>
        <Paragraph color="primary" size="lg">
          Add additional owners (e.g. wallets of your teammates) and specify how many of them have to confirm a
          transaction before it gets executed. In general, the more confirmations required, the more secure your Safe
          is.
          <StyledLink
            href="https://help.gnosis-safe.io/en/articles/4772567-what-gnosis-safe- setup-should-i-use"
            target="_blank"
            rel="noreferrer"
            title="Learn about which Safe setup to use"
          >
            <Text size="xl" as="span" color="primary">
              Learn about which Safe setup to use
            </Text>
            <Icon size="sm" type="externalLink" color="primary" />
          </StyledLink>
          . The new Safe will ONLY be available on <NetworkLabel />
        </Paragraph>
      </BlockWithPadding>
      <Hairline />
      <RowHeader>
        <Col xs={3}>NAME</Col>
        <Col xs={7}>ADDRESS</Col>
      </RowHeader>
      <Hairline />
      <Block margin="md" padding="md">
        <RowHeader>
          {owners.map(({ nameFieldName, addressFieldName }, i: number) => {
            const hasOwnerAddressError = formErrors[addressFieldName]
            const ownerAddress = createSafeFormValues[addressFieldName]
            const showDeleteIcon = addressFieldName !== 'owner-address-0' // we hide de delete icon for the first owner
            const ownerName = ownersWithENSName[ownerAddress] || 'Owner Name'

            const isRepeated = (value: string) => {
              const prevOwners = owners.filter((_: typeof owners[number], index: number) => index !== i)
              const repeated = prevOwners.some((owner: typeof owners[number]) => {
                return sameString(createSafeFormValues[owner.addressFieldName], value)
              })
              return repeated ? ADDRESS_REPEATED_ERROR : undefined
            }

            return (
              <Fragment key={addressFieldName}>
                <Col xs={3}>
                  <OwnerNameField
                    component={TextField}
                    name={nameFieldName}
                    placeholder={ownerName}
                    label="Owner Name"
                    type="text"
                    validate={minMaxLength(0, 50)}
                    testId={nameFieldName}
                  />
                </Col>
                <Col xs={7}>
                  <AddressInput
                    fieldMutator={async (address) => {
                      createSafeForm.change(addressFieldName, address)
                      const addressName = addressBook[address]?.name
                      if (addressName) {
                        createSafeForm.change(nameFieldName, addressName)
                      } else {
                        await getENSName(address)
                      }
                    }}
                    inputAdornment={
                      !hasOwnerAddressError && {
                        endAdornment: (
                          <InputAdornment position="end">
                            <CheckIconAddressAdornment data-testid={`${addressFieldName}-valid-adornment`} />
                          </InputAdornment>
                        ),
                      }
                    }
                    name={addressFieldName}
                    placeholder="Owner Address*"
                    text="Owner Address"
                    testId={addressFieldName}
                    validators={[isRepeated]}
                  />
                </Col>
                <OwnersIconsContainer xs={1} center="xs" middle="xs">
                  <ScanQRWrapper
                    handleScan={(...args) => handleScan(...args, addressFieldName)}
                    testId={`${addressFieldName}-scan-QR`}
                  />
                </OwnersIconsContainer>
                {showDeleteIcon && (
                  <OwnersIconsContainer xs={1} center="xs" middle="xs">
                    <ButtonHelper
                      onClick={() => onClickRemoveOwner({ addressFieldName })}
                      dataTestId={`${addressFieldName}-remove-button`}
                    >
                      <Icon size="sm" type="delete" color="icon" tooltip="Delete Owner" />
                    </ButtonHelper>
                  </OwnersIconsContainer>
                )}
              </Fragment>
            )
          })}
        </RowHeader>
        <OwnerContainer align="center" grow>
          <Button color="secondary" data-testid="add-new-owner" onClick={onClickAddNewOwner}>
            <Paragraph noMargin size="lg">
              + Add another owner
            </Paragraph>
          </Button>
        </OwnerContainer>
        <BlockWithPadding>
          <Block>
            <Paragraph>Any transaction requires the confirmation of:</Paragraph>
          </Block>
          <OwnerContainer align="center" grow>
            <Col xs={1}>
              <Field
                component={SelectField}
                data-testid="threshold-selector-input"
                name={FIELD_NEW_SAFE_THRESHOLD}
                validate={(val) => {
                  const isValidThreshold = () => {
                    return !!threshold && threshold <= owners.length ? undefined : THRESHOLD_ERROR
                  }
                  return composeValidators(required, minValue(1), isValidThreshold)(val)
                }}
              >
                {owners.map((_, option) => (
                  <MenuItem
                    key={`threshold-selector-option-${option}`}
                    value={option + 1}
                    data-testid={`threshold-selector-option-${option + 1}`}
                  >
                    {option + 1}
                  </MenuItem>
                ))}
              </Field>
            </Col>
            <Col xs={11}>
              <StyledParagraph noMargin>out of {owners.length} owner(s)</StyledParagraph>
            </Col>
          </OwnerContainer>
        </BlockWithPadding>
      </Block>
    </>
  )
}

export default OwnersAndConfirmationsNewSafeStep

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const ParagraphWithMargin = styled(Paragraph)`
  margin-bottom: 12px;
`

const StyledLink = styled(Link)`
  padding: 0 ${xs};
  & svg {
    position: relative;
    top: 1px;
    left: ${xs};
    height: 14px;
    width: 14px;
  }
`
const RowHeader = styled(Row)`
  padding: ${sm} ${lg};
  font-size: ${extraSmallFontSize};
  color: ${disabled};
`

const OwnerNameField = styled(Field)`
  margin-right: ${md};
  margin-bottom: ${md};
`
const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`

const OwnersIconsContainer = styled(Col)`
  height: 56px;
  max-width: 32px;
  cursor: pointer;
`

const OwnerContainer = styled(Row)`
  justify-content: center;
`

const StyledParagraph = styled(Paragraph)`
  padding-left: 12px;
`
