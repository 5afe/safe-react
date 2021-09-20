import { useEffect, ReactElement, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
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
import { useStepper } from 'src/components/NewStepper/stepperContext'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { disabled, extraSmallFontSize, lg, sm, xs } from 'src/theme/variables'
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
import { FIELD_MAX_OWNER_NUMBER, FIELD_NEW_SAFE_THRESHOLD, FIELD_SAFE_OWNERS_LIST } from '../fields/createSafeFields'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'

export const ownersAndConfirmationsNewSafeStepLabel = 'Owners and Confirmations'

function OwnersAndConfirmationsNewSafeStep(): ReactElement {
  const classes = useStyles()

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

    const hasToUpdateThreshold = threshold > ownersUpdated.length

    if (hasToUpdateThreshold) {
      createSafeForm.change(FIELD_NEW_SAFE_THRESHOLD, threshold - 1)
    }
  }

  return (
    <>
      <Block className={classes.padding} data-testid={'create-safe-owners-confirmation-step'}>
        <Paragraph className={classes.marginBottom} color="primary" noMargin size="lg">
          Your Safe will have one or more owners. We have prefilled the first owner with your connected wallet details,
          but you are free to change this to a different owner.
        </Paragraph>
        <Paragraph color="primary" size="lg" className={classes.descriptionContainer}>
          Add additional owners (e.g. wallets of your teammates) and specify how many of them have to confirm a
          transaction before it gets executed. In general, the more confirmations required, the more secure is your
          Safe.
          <Link
            href="https://help.gnosis-safe.io/en/articles/4772567-what-gnosis-safe- setup-should-i-use"
            target="_blank"
            className={classes.link}
            rel="noreferrer"
            title="Learn about which Safe setup to use"
          >
            <Text size="xl" as="span" color="primary">
              Learn about which Safe setup to use
            </Text>
            <Icon size="sm" type="externalLink" color="primary" />
          </Link>
          . The new Safe will ONLY be available on <NetworkLabel />
        </Paragraph>
      </Block>
      <Hairline />
      <Row className={classes.header}>
        <Col xs={3}>NAME</Col>
        <Col xs={7}>ADDRESS</Col>
      </Row>
      <Hairline />
      <Block margin="md" padding="md">
        <Row className={classes.header}>
          {owners.map(({ nameFieldName, addressFieldName }) => {
            const hasOwnerAddressError = formErrors[addressFieldName]
            const showDeleteIcon = addressFieldName !== 'owner-address-0' // we hide de delete icon for the first owner

            const handleScan = (address: string, closeQrModal: () => void): void => {
              createSafeForm.change(addressFieldName, address)
              closeQrModal()
            }

            return (
              <Fragment key={addressFieldName}>
                <Col xs={3}>
                  <Field
                    className={classes.ownerNameField}
                    component={TextField}
                    name={nameFieldName}
                    placeholder="Owner Name"
                    text="Owner Name"
                    type="text"
                    validate={minMaxLength(0, 50)}
                    testId={nameFieldName}
                  />
                </Col>
                <Col xs={7}>
                  <AddressInput
                    fieldMutator={(address) => {
                      createSafeForm.change(addressFieldName, address)
                      const addressName = addressBook[address]?.name
                      if (addressName) {
                        createSafeForm.change(nameFieldName, addressName)
                      }
                    }}
                    // eslint-disable-next-line
                    // @ts-ignore
                    inputAdornment={
                      !hasOwnerAddressError && {
                        endAdornment: (
                          <InputAdornment position="end">
                            <CheckCircle
                              className={classes.checkIcon}
                              data-testid={`${addressFieldName}-valid-adornment`}
                            />
                          </InputAdornment>
                        ),
                      }
                    }
                    name={addressFieldName}
                    required
                    placeholder="Owner Address*"
                    text="Owner Address"
                    testId={addressFieldName}
                  />
                </Col>
                <Col xs={1} center="xs" className={classes.ownerIcons} middle="xs">
                  <ScanQRWrapper handleScan={handleScan} testId={`${addressFieldName}-scan-QR`} />
                </Col>
                {showDeleteIcon && (
                  <Col xs={1} center="xs" className={classes.ownerIcons} middle="xs">
                    <ButtonHelper
                      onClick={() => onClickRemoveOwner({ addressFieldName })}
                      dataTestId={`${addressFieldName}-remove-button`}
                    >
                      <Icon size="sm" type="delete" color="icon" tooltip="Delete Owner" />
                    </ButtonHelper>
                  </Col>
                )}
              </Fragment>
            )
          })}
        </Row>
        <Row align="center" className={classes.addOwnerContainer} grow>
          <Button color="secondary" data-testid="add-new-owner" onClick={onClickAddNewOwner}>
            <Paragraph noMargin size="lg">
              + Add another owner
            </Paragraph>
          </Button>
        </Row>
        <div className={classes.padding}>
          <Block>
            <Paragraph>Any transaction requires the confirmation of:</Paragraph>
          </Block>
          <Row align="center" className={classes.addOwnerContainer} grow>
            <Col xs={1}>
              <Field
                component={SelectField}
                data-testid="threshold-selector-input"
                name={FIELD_NEW_SAFE_THRESHOLD}
                validate={composeValidators(required, minValue(1))}
              >
                {Array.from(Array(owners.length).keys()).map((option) => (
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
              <Paragraph noMargin className={classes.paddingLeft}>
                out of {owners.length} owner(s)
              </Paragraph>
            </Col>
          </Row>
        </div>
      </Block>
    </>
  )
}

export default OwnersAndConfirmationsNewSafeStep

export const ownersAndConfirmationsNewSafeStepValidations = (values: {
  [FIELD_SAFE_OWNERS_LIST]: Array<Record<string, string>>
  [FIELD_NEW_SAFE_THRESHOLD]: number
}): Record<string, string> => {
  const errors = {}

  const owners = values[FIELD_SAFE_OWNERS_LIST]
  const threshold = values[FIELD_NEW_SAFE_THRESHOLD]
  const addresses = owners.map(({ addressFieldName }) => values[addressFieldName])

  // we check repeated addresses
  owners.forEach(({ addressFieldName }, index) => {
    const address = values[addressFieldName]
    const previousOwners = addresses.slice(0, index)
    const isRepeated = previousOwners.includes(address)
    if (isRepeated) {
      errors[addressFieldName] = ADDRESS_REPEATED_ERROR
    }
  })

  const isValidThreshold = !!threshold && threshold <= owners.length
  if (!isValidThreshold) {
    errors[FIELD_NEW_SAFE_THRESHOLD] = THRESHOLD_ERROR
  }

  return errors
}

const useStyles = makeStyles({
  padding: {
    padding: lg,
  },
  marginBottom: {
    marginBottom: '12px',
  },
  descriptionContainer: {
    display: 'inline',
  },
  link: {
    padding: `0 ${xs}`,
    '& svg': {
      position: 'relative',
      top: '1px',
      left: `${xs}`,
      height: '14px',
      width: '14px',
    },
  },
  header: {
    padding: `${sm} ${lg}`,
    fontSize: extraSmallFontSize,
    color: disabled,
  },
  ownerNameField: {
    marginRight: `${sm}`,
    marginBottom: `${sm}`,
  },
  checkIcon: {
    color: '#03AE60',
    height: '20px',
  },
  ownerIcons: {
    height: '56px',
    maxWidth: '32px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  addOwnerContainer: {
    justifyContent: 'center',
  },
  paddingLeft: {
    paddingLeft: '12px',
  },
})
