import React, { ReactElement, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import CheckCircle from '@material-ui/icons/CheckCircle'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useField, useForm } from 'react-final-form'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import AddressInput from 'src/components/forms/AddressInput'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { lg } from 'src/theme/variables'
import { useEffect } from 'react'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { useSelector } from 'react-redux'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import { FIELD_SAFE_THRESHOLD } from './ReviewLoadStep'
import { FIELD_SAFE_OWNER_LIST } from './LoadSafeOwnersStep'

export const FIELD_LOAD_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_LOAD_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_LOAD_SAFE_ADDRESS = 'safeAddress'

export const loadSafeAddressStepLabel = 'Name and address'

function LoadSafeAddressStep(): ReactElement {
  const [ownersWithName, setOwnersWithName] = useState<AddressBookEntry[]>([])
  const [threshold, setThreshold] = useState<number>()
  const [isValidSafeAddress, setIsValidSafeAddress] = useState<boolean>(false)

  const classes = useStyles()

  const loadSafeForm = useForm()
  const addressBook = useSelector(currentNetworkAddressBookAsMap)

  const {
    input: { value: safeAddress },
    meta: { error: safeAddressError },
  } = useField(FIELD_LOAD_SAFE_ADDRESS)

  useEffect(() => {
    setOwnersWithName([])
    setThreshold(undefined)
    setIsValidSafeAddress(false)
  }, [safeAddress])

  useEffect(() => {
    async function checkSafeAddress() {
      const isValidSafeAddress = safeAddress && !mustBeEthereumAddress(safeAddress)
      if (isValidSafeAddress) {
        try {
          const { owners, threshold }: SafeInfo = await getSafeInfo(safeAddress)
          const ownersWithName = owners.map(({ value: address }) =>
            makeAddressBookEntry(addressBook[address] || { address, name: '' }),
          )
          setOwnersWithName(ownersWithName)
          setThreshold(threshold)
          setIsValidSafeAddress(true)
        } catch (error) {
          setOwnersWithName([])
          setThreshold(undefined)
          setIsValidSafeAddress(false)
        }
      }
    }

    checkSafeAddress()
  }, [safeAddress, addressBook])

  useEffect(() => {
    if (threshold) {
      loadSafeForm.change(FIELD_SAFE_THRESHOLD, threshold)
    }
  }, [threshold, loadSafeForm])

  useEffect(() => {
    if (ownersWithName) {
      loadSafeForm.change(FIELD_SAFE_OWNER_LIST, ownersWithName)
    }
  }, [ownersWithName, loadSafeForm])

  const handleScan = (value: string, closeQrModal: () => void): void => {
    loadSafeForm.change(FIELD_LOAD_SAFE_ADDRESS, value)
    closeQrModal()
  }

  const formValues = loadSafeForm.getState().values
  const safeName = formValues[FIELD_LOAD_CUSTOM_SAFE_NAME] || formValues[FIELD_LOAD_SUGGESTED_SAFE_NAME]

  return (
    <Block className={classes.padding}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="md">
          You are about to add an existing Gnosis Safe. First, choose a name and enter the Safe address. The name is
          only stored locally and will never be shared with Gnosis or any third parties.
          <br />
          Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide you
          a read-only view.
        </Paragraph>

        <Paragraph color="primary" size="md" className={classes.links}>
          Don&apos;t have the address of the Safe you created?{' '}
          <a
            href="https://help.gnosis-safe.io/en/articles/4971293-i-don-t-remember-my-safe-address-where-can-i-find-it"
            rel="noopener noreferrer"
            target="_blank"
          >
            This article explains how to find it.
          </a>
        </Paragraph>
      </Block>
      <Block className={classes.root}>
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_LOAD_CUSTOM_SAFE_NAME}
            placeholder={safeName}
            text="Safe name"
            type="text"
            testId="load-safe-name-field"
          />
        </Col>
      </Block>
      <Block className={classes.root} margin="lg">
        <Col xs={11}>
          <AddressInput
            fieldMutator={(val) => {
              loadSafeForm.change(FIELD_LOAD_SAFE_ADDRESS, val)
            }}
            // eslint-disable-next-line
            // @ts-ignore
            inputAdornment={
              isValidSafeAddress &&
              !safeAddressError && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle
                      className={classes.check}
                      data-testid={`${FIELD_LOAD_SAFE_ADDRESS}-valid-address-adornment`}
                    />
                  </InputAdornment>
                ),
              }
            }
            name={FIELD_LOAD_SAFE_ADDRESS}
            placeholder="Safe Address*"
            text="Safe Address"
            testId="load-safe-address-field"
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Block>
      <Block margin="sm">
        <Paragraph className={classes.links} color="primary" noMargin size="md">
          By continuing you consent to the{' '}
          <a href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </a>
          {' and '}
          <a href="https://gnosis-safe.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
          .
        </Paragraph>
      </Block>
    </Block>
  )
}

export default LoadSafeAddressStep

export const loadSafeAddressStepValidations = (values: {
  [FIELD_LOAD_SAFE_ADDRESS]: string
  [FIELD_SAFE_OWNER_LIST]: string
}): Record<string, string> => {
  let errors = {}

  const safeAddress = values[FIELD_LOAD_SAFE_ADDRESS]
  const ownerList = values[FIELD_SAFE_OWNER_LIST]

  if (!safeAddress) {
    errors = {
      ...errors,
      [FIELD_LOAD_SAFE_ADDRESS]: 'Required',
    }
    return errors
  }

  const hasOwners = ownerList.length > 0

  const isValidSafeAddress = safeAddress && !mustBeEthereumAddress(safeAddress) && hasOwners

  // TODO: Create a isLoading in the form and return a isLoading error instead of a SafeAddress error

  if (!isValidSafeAddress) {
    errors = {
      ...errors,
      [FIELD_LOAD_SAFE_ADDRESS]: 'Address given is not a valid Safe address',
    }
  }

  return errors
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: '460px',
    marginTop: '12px',
  },
  padding: {
    padding: lg,
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  links: {
    '&>a': {
      color: theme.palette.secondary.main,
    },
  },
}))
