import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import AddressBookInput from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'

const KEYCODES = {
  TAB: 9,
  SHIFT: 16,
}

const BeneficiaryInput = styled.div`
  grid-area: beneficiaryInput;
`

const BeneficiaryScan = styled.div`
  grid-area: beneficiaryScan;
`

const BeneficiarySelect = (): React.ReactElement => {
  const { initialValues } = useFormState()
  const { mutators } = useForm()

  const [selectedEntry, setSelectedEntry] = React.useState<{ address: string; name: string } | null>({
    address: initialValues?.beneficiary || '',
    name: '',
  })

  const [pristine, setPristine] = React.useState<boolean>(!initialValues?.beneficiary)

  React.useEffect(() => {
    if (selectedEntry === null) {
      mutators?.setBeneficiary?.('')

      if (pristine) {
        setPristine(false)
      }
    }
  }, [mutators, pristine, selectedEntry])

  const addressBook = useSelector(getAddressBook)

  const handleScan = (value, closeQrModal) => {
    let scannedAddress = value

    if (scannedAddress.startsWith('ethereum:')) {
      scannedAddress = scannedAddress.replace('ethereum:', '')
    }

    const scannedName = addressBook ? getNameFromAdbk(addressBook, scannedAddress) : ''

    mutators?.setBeneficiary?.(scannedAddress)

    setSelectedEntry({
      name: scannedName,
      address: scannedAddress,
    })

    closeQrModal()
  }

  return selectedEntry !== null && selectedEntry.address ? (
    <BeneficiaryInput
      role="button"
      aria-pressed="false"
      tabIndex={0}
      onKeyDown={(e) => {
        if (![KEYCODES.TAB, KEYCODES.SHIFT].includes(e.keyCode)) {
          setSelectedEntry(null)
        }
      }}
      onClick={() => {
        setSelectedEntry(null)
      }}
    >
      <EthHashInfo
        hash={selectedEntry.address}
        name={selectedEntry.name}
        showCopyBtn
        showEtherscanBtn
        showIdenticon
        textSize="lg"
        network={getNetwork()}
      />
    </BeneficiaryInput>
  ) : (
    <>
      <BeneficiaryInput>
        <AddressBookInput
          fieldMutator={mutators?.setBeneficiary}
          pristine={pristine}
          setSelectedEntry={setSelectedEntry}
          label="Beneficiary"
        />
      </BeneficiaryInput>
      <BeneficiaryScan>
        <ScanQRWrapper handleScan={handleScan} />
      </BeneficiaryScan>
    </>
  )
}

export default BeneficiarySelect
