import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { replaceSafeOwner } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { safeParamAddressFromStateSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

import { OwnerForm } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/OwnerForm'
import { ReviewReplaceOwnerModal } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/Review'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

export type OwnerValues = {
  newOwnerAddress: string
  newOwnerName: string
}

export const sendReplaceOwner = async (
  values: OwnerValues,
  safeAddress: string,
  ownerAddressToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
  threshold?: number,
): Promise<void> => {
  const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.methods.getOwners().call()
  const index = safeOwners.findIndex((ownerAddress) => sameAddress(ownerAddress, ownerAddressToRemove))
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.methods.swapOwner(prevAddress, ownerAddressToRemove, values.newOwnerAddress).encodeABI()

  const txHash = await dispatch(
    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: '0',
      txData,
      txNonce: txParameters.safeNonce,
      safeTxGas: txParameters.safeTxGas ? Number(txParameters.safeTxGas) : undefined,
      ethParameters: txParameters,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
    }),
  )

  if (txHash && threshold === 1) {
    dispatch(
      replaceSafeOwner({
        safeAddress,
        oldOwnerAddress: ownerAddressToRemove,
        ownerAddress: values.newOwnerAddress,
        ownerName: values.newOwnerName,
      }),
    )
  }
}

type ReplaceOwnerProps = {
  isOpen: boolean
  onClose: () => void
  ownerAddress: string
  ownerName: string
}

export const ReplaceOwnerModal = ({
  isOpen,
  onClose,
  ownerAddress,
  ownerName,
}: ReplaceOwnerProps): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState({
    newOwnerAddress: '',
    newOwnerName: '',
  })
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const threshold = useSelector(safeThresholdSelector) || 1

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
      setValues({
        newOwnerAddress: '',
        newOwnerName: '',
      })
    },
    [isOpen],
  )

  const onClickBack = () => setActiveScreen('checkOwner')

  const ownerSubmitted = (newValues) => {
    const { ownerAddress, ownerName } = newValues
    const checksumAddr = checksumAddress(ownerAddress)
    setValues({
      newOwnerAddress: checksumAddr,
      newOwnerName: ownerName,
    })
    setActiveScreen('reviewReplaceOwner')
  }

  const onReplaceOwner = async (txParameters: TxParameters) => {
    onClose()
    try {
      await sendReplaceOwner(values, safeAddress, ownerAddress, dispatch, txParameters, threshold)

      dispatch(
        addOrUpdateAddressBookEntry(
          makeAddressBookEntry({ address: values.newOwnerAddress, name: values.newOwnerName }),
        ),
      )
    } catch (error) {
      console.error('Error while removing an owner', error)
    }
  }

  return (
    <Modal
      description="Replace owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="bigger-modal-window"
      title="Replace owner from Safe"
    >
      <>
        {activeScreen === 'checkOwner' && (
          <OwnerForm
            onClose={onClose}
            onSubmit={ownerSubmitted}
            initialValues={values}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
          />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwnerModal
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onReplaceOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}
