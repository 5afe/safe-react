import { KeyboardEvent, ReactElement, useEffect, useState } from 'react'
import { useForm, useFormState } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { sameString } from 'src/utils/strings'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { mustBeEthereumAddress } from 'src/components/forms/validator'

const BeneficiaryInput = styled.div`
  grid-area: beneficiaryInput;
  max-width: 100%;
  word-break: break-all;
`

const BeneficiaryScan = styled.div`
  grid-area: beneficiaryScan;
`

const Beneficiary = (): ReactElement => {
  const { initialValues } = useFormState()
  const { mutators } = useForm()
  const [addressErrorMsg, setAddressErrorMsg] = useState('')

  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name?: string } | null>({
    address: initialValues?.beneficiary || '',
    name: '',
  })

  const [pristine, setPristine] = useState<boolean>(!initialValues?.beneficiary)

  useEffect(() => {
    if (selectedEntry === null) {
      mutators?.setBeneficiary?.('')

      if (pristine) {
        setPristine(false)
      }
    }
  }, [mutators, pristine, selectedEntry])

  const addressBook = useSelector(currentNetworkAddressBook)

  const handleScan = (value: string, closeQrModal: () => void) => {
    const scannedAddress = value.startsWith('ethereum:') ? value.replace('ethereum:', '') : value
    const scannedName = addressBook.find(({ address }) => {
      return sameAddress(scannedAddress, address)
    })?.name

    const addressErrorMessage = mustBeEthereumAddress(scannedAddress)
    if (!addressErrorMessage) {
      mutators?.setBeneficiary?.(scannedAddress)

      setSelectedEntry({
        name: scannedName,
        address: scannedAddress,
      })
      setAddressErrorMsg('')
    } else setAddressErrorMsg(addressErrorMessage)

    closeQrModal()
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLElement>): void => {
    if (sameString(e.key, 'Tab')) {
      return
    }
    setSelectedEntry(null)
  }

  const handleOnClick = () => {
    setSelectedEntry(null)
  }

  return selectedEntry?.address ? (
    <BeneficiaryInput
      role="button"
      aria-pressed="false"
      tabIndex={0}
      onKeyDown={handleOnKeyDown}
      onClick={handleOnClick}
    >
      <PrefixedEthHashInfo
        hash={selectedEntry.address}
        name={selectedEntry.name}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={getExplorerInfo(selectedEntry.address)}
      />
    </BeneficiaryInput>
  ) : (
    <>
      <BeneficiaryInput>
        <AddressBookInput
          fieldMutator={mutators?.setBeneficiary}
          pristine={pristine}
          errorMsg={addressErrorMsg}
          setSelectedEntry={setSelectedEntry}
          setIsValidAddress={() => {}}
          label="Beneficiary"
        />
      </BeneficiaryInput>
      <BeneficiaryScan>
        <ScanQRWrapper handleScan={handleScan} />
      </BeneficiaryScan>
    </>
  )
}

export default Beneficiary
