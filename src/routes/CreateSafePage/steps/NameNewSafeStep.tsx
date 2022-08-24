import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-final-form'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import { lg, secondary } from 'src/theme/variables'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import {
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_SAFE_OWNER_ENS_LIST,
} from '../fields/createSafeFields'
import { useStepper } from 'src/components/Stepper/stepperContext'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { reverseENSLookup } from 'src/logic/wallets/getWeb3'
import { trackEvent } from 'src/utils/googleTagManager'
import { CREATE_SAFE_EVENTS } from 'src/utils/events/createLoadSafe'

export const nameNewSafeStepLabel = 'Name'

function NameNewSafeStep(): ReactElement {
  const [ownersWithENSName, setOwnersWithENSName] = useState<Record<string, string>>({})
  const provider = useSelector(providerNameSelector)

  const { setCurrentStep } = useStepper()

  useEffect(() => {
    if (!provider) {
      setCurrentStep(0)
    }
  }, [provider, setCurrentStep])

  const createNewSafeForm = useForm()
  const formValues = createNewSafeForm.getState().values
  const hasCustomSafeName = !!formValues[FIELD_CREATE_CUSTOM_SAFE_NAME]

  useEffect(() => {
    // On unmount, e.g. go back/next
    return () => {
      if (hasCustomSafeName) {
        trackEvent(CREATE_SAFE_EVENTS.NAME_SAFE)
      }
    }
  }, [hasCustomSafeName])

  useEffect(() => {
    const getInitialOwnerENSNames = async () => {
      const formValues = createNewSafeForm.getState().values
      const owners = formValues[FIELD_SAFE_OWNERS_LIST]
      const ownersWithENSName = await Promise.all(
        owners
          .filter(({ addressFieldName }) => !!formValues[addressFieldName])
          .map(async ({ addressFieldName }) => {
            const address = formValues[addressFieldName]
            const ensName = await reverseENSLookup(address)
            return {
              address,
              name: ensName,
            }
          }),
      )

      const ownersWithENSNameRecord = ownersWithENSName.reduce<Record<string, string>>((acc, { address, name }) => {
        return {
          ...acc,
          [address]: name,
        }
      }, {})

      setOwnersWithENSName(ownersWithENSNameRecord)
    }
    getInitialOwnerENSNames()
  }, [createNewSafeForm])

  useEffect(() => {
    if (ownersWithENSName) {
      createNewSafeForm.change(FIELD_SAFE_OWNER_ENS_LIST, ownersWithENSName)
    }
  }, [ownersWithENSName, createNewSafeForm])

  return (
    <BlockWithPadding data-testid={'create-safe-name-step'}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="lg">
          You are about to create a new Safe wallet with one or more owners. First, let&apos;s give your new wallet a
          name. This name is only stored locally and will never be shared with us or any third parties. The new Safe
          will ONLY be available on <NetworkLabel />
        </Paragraph>
      </Block>
      <label htmlFor={FIELD_CREATE_CUSTOM_SAFE_NAME}>Name of the new Safe</label>
      <FieldContainer margin="lg">
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_CREATE_CUSTOM_SAFE_NAME}
            placeholder={formValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]}
            label="Safe name"
            type="text"
            testId="create-safe-name-field"
          />
        </Col>
      </FieldContainer>
      <Block margin="lg">
        <Paragraph color="primary" noMargin size="lg">
          By continuing you consent to the{' '}
          <Link href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </Link>
          {' and '}
          <Link href="https://gnosis-safe.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </Link>
          .
        </Paragraph>
      </Block>
    </BlockWithPadding>
  )
}

export default NameNewSafeStep

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const FieldContainer = styled(Block)`
  display: flex;
  max-width: 480px;
  margin-top: 12px;
`

const Link = styled.a`
  color: ${secondary};
`
