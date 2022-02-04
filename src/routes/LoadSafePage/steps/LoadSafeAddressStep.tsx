import { ReactElement, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useField, useForm } from 'react-final-form'
import styled from 'styled-components'
import CheckCircle from '@material-ui/icons/CheckCircle'
import InputAdornment from '@material-ui/core/InputAdornment'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import AddressInput from 'src/components/forms/AddressInput'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { isValidAddress } from 'src/utils/isValidAddress'
import { isChecksumAddress } from 'src/utils/checksumAddress'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { lg, secondary } from 'src/theme/variables'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_IS_LOADING_SAFE_ADDRESS,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_SAFE_OWNER_ENS_LIST,
  FIELD_SAFE_OWNER_LIST,
  FIELD_SAFE_THRESHOLD,
  LoadSafeFormValues,
} from '../fields/loadFields'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { getLoadSafeName } from '../fields/utils'
import { currentChainId } from 'src/logic/config/store/selectors'
import { reverseENSLookup } from 'src/logic/wallets/getWeb3'

export const loadSafeAddressStepLabel = 'Name and address'

function LoadSafeAddressStep(): ReactElement {
  const [ownersWithName, setOwnersWithName] = useState<AddressBookEntry[]>([])
  const [ownersWithENSName, setOwnersWithENSName] = useState<Record<string, string>>({})
  const [threshold, setThreshold] = useState<number>()
  const [isValidSafeAddress, setIsValidSafeAddress] = useState<boolean>(false)
  const [isSafeInfoLoading, setIsSafeInfoLoading] = useState<boolean>(false)
  const chainId = useSelector(currentChainId)

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
    const checkSafeAddress = async () => {
      const isValidSafeAddress = isValidAddress(safeAddress) && isChecksumAddress(safeAddress)
      if (!isValidSafeAddress) {
        return
      }

      setIsSafeInfoLoading(true)
      try {
        const { owners, threshold } = await getSafeInfo(safeAddress)
        setIsSafeInfoLoading(false)
        const ownersWithName = owners.map(({ value: address }) => {
          return makeAddressBookEntry(addressBook[address] || { address, name: '', chainId })
        })

        const ownersWithENSName = await Promise.all(
          owners.map(async ({ value: address }) => {
            const ensName = await reverseENSLookup(address)
            return makeAddressBookEntry({ address, name: ensName, chainId })
          }),
        )

        const ownersWithENSNameRecord = ownersWithENSName.reduce<Record<string, string>>((acc, { address, name }) => {
          return {
            ...acc,
            [address]: name,
          }
        }, {})

        setOwnersWithName(ownersWithName)
        setOwnersWithENSName(ownersWithENSNameRecord)
        setThreshold(threshold)
        setIsValidSafeAddress(true)
      } catch (error) {
        setOwnersWithName([])
        setThreshold(undefined)
        setIsValidSafeAddress(false)
      }
      setIsSafeInfoLoading(false)
    }

    checkSafeAddress()
  }, [safeAddress, addressBook, chainId])

  useEffect(() => {
    if (threshold) {
      loadSafeForm.change(FIELD_SAFE_THRESHOLD, threshold)
    }
  }, [threshold, loadSafeForm])

  useEffect(() => {
    loadSafeForm.change(FIELD_LOAD_IS_LOADING_SAFE_ADDRESS, isSafeInfoLoading)
  }, [isSafeInfoLoading, loadSafeForm])

  useEffect(() => {
    if (ownersWithName) {
      loadSafeForm.change(FIELD_SAFE_OWNER_LIST, ownersWithName)
    }
  }, [ownersWithName, loadSafeForm])

  useEffect(() => {
    if (ownersWithENSName) {
      loadSafeForm.change(FIELD_SAFE_OWNER_ENS_LIST, ownersWithENSName)
    }
  }, [ownersWithENSName, loadSafeForm])

  const handleScan = (value: string, closeQrModal: () => void): void => {
    loadSafeForm.change(FIELD_LOAD_SAFE_ADDRESS, value)
    closeQrModal()
  }

  const formValues = loadSafeForm.getState().values as LoadSafeFormValues
  const safeName = getLoadSafeName(formValues, addressBook)

  return (
    <Container data-testid={'load-safe-address-step'}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="lg">
          You are about to add an existing Boba Multisig on <NetworkLabel />. First, choose a name and enter the Safe
          address. The name is only stored locally and will never be shared with Gnosis or any third parties.
        </Paragraph>
        <Paragraph color="primary" size="lg">
          Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide you
          a read-only view.
        </Paragraph>

        <Paragraph color="primary" size="lg">
          Don&apos;t have the address of the Safe you created?{' '}
          <StyledLink
            href="https://help.gnosis-safe.io/en/articles/4971293-i-don-t-remember-my-safe-address-where-can-i-find-it"
            rel="noopener noreferrer"
            target="_blank"
          >
            This article explains how to find it.
          </StyledLink>
        </Paragraph>
      </Block>
      <FieldContainer>
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
      </FieldContainer>
      <FieldContainer margin="lg">
        <Col xs={11}>
          <AddressInput
            fieldMutator={(val) => {
              loadSafeForm.change(FIELD_LOAD_SAFE_ADDRESS, val)
            }}
            inputAdornment={
              isValidSafeAddress &&
              !safeAddressError && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckIconAddressAdornment data-testid={`${FIELD_LOAD_SAFE_ADDRESS}-valid-address-adornment`} />
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
        <Col center="xs" middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </FieldContainer>
      <Block margin="sm">
        <Paragraph color="primary" noMargin size="lg">
          By continuing you consent to the{' '}
          <StyledLink href="https://www.enya.ai/utility/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </StyledLink>
          {' and '}
          <StyledLink href="https://www.enya.ai/utility/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </StyledLink>
          . Most importantly, you confirm that your funds are held securely in the Boba Multisig, a smart contract on
          the Ethereum blockchain. These funds cannot be accessed by Gnosis at any point.
        </Paragraph>
      </Block>
    </Container>
  )
}

export default LoadSafeAddressStep

export const loadSafeAddressStepValidations = (values: {
  [FIELD_LOAD_SAFE_ADDRESS]: string
  [FIELD_SAFE_OWNER_LIST]: string
}): Record<string, string> => {
  let errors = {}

  const safeAddress = values[FIELD_LOAD_SAFE_ADDRESS]

  if (!safeAddress) {
    errors = {
      ...errors,
      [FIELD_LOAD_SAFE_ADDRESS]: 'Required',
    }
    return errors
  }

  // this is to prevent show and error in the safe address field while is loading...
  const isLoadingSafeAddress = values[FIELD_LOAD_IS_LOADING_SAFE_ADDRESS]
  if (isLoadingSafeAddress) {
    return {
      ...errors,
      [FIELD_LOAD_IS_LOADING_SAFE_ADDRESS]: 'loading...',
    }
  }

  // check that the address is actually a Safe (must have owners)
  const ownerList = values[FIELD_SAFE_OWNER_LIST]
  const isValidSafeAddress = ownerList.length > 0 && isValidAddress(safeAddress)
  if (!isValidSafeAddress) {
    errors = {
      ...errors,
      [FIELD_LOAD_SAFE_ADDRESS]: 'Address given is not a valid Safe address',
    }
  }

  return errors
}

const Container = styled(Block)`
  padding: ${lg};
`

const FieldContainer = styled(Block)`
  display: flex;
  max-width: 480px;
  margin-top: 12px;
`

const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`

const StyledLink = styled.a`
  color: ${secondary};
`
