import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { SENTINEL_ADDRESS, getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { checksumAddress } from 'src/utils/checksumAddress'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

import { OwnerForm } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/OwnerForm'
import { ReviewReplaceOwnerModal } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/Review'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { isValidAddress } from 'src/utils/isValidAddress'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

export type OwnerValues = {
  address: string
  name: string
}

export const sendReplaceOwner = async (
  newOwner: OwnerValues,
  safeAddress: string,
  ownerAddressToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
): Promise<void> => {
  const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
  const safeOwners = await gnosisSafe.methods.getOwners().call()
  const index = safeOwners.findIndex((ownerAddress) => sameAddress(ownerAddress, ownerAddressToRemove))
  const prevAddress = index === 0 ? SENTINEL_ADDRESS : safeOwners[index - 1]
  const txData = gnosisSafe.methods.swapOwner(prevAddress, ownerAddressToRemove, newOwner.address).encodeABI()

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

  if (txHash) {
    // update the AB
    dispatch(addressBookAddOrUpdate(makeAddressBookEntry(newOwner)))
  }
}

type ReplaceOwnerProps = {
  isOpen: boolean
  onClose: () => void
  owner: OwnerData
}

export const ReplaceOwnerModal = ({ isOpen, onClose, owner }: ReplaceOwnerProps): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [newOwner, setNewOwner] = useState({ address: '', name: '' })
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeAddressFromUrl)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
      setNewOwner({ address: '', name: '' })
    },
    [isOpen],
  )

  const onClickBack = () => setActiveScreen('checkOwner')

  const ownerSubmitted = (newValues) => {
    const { ownerAddress, ownerName } = newValues

    if (isValidAddress(ownerAddress)) {
      const checksumAddr = checksumAddress(ownerAddress)
      setNewOwner({ address: checksumAddr, name: ownerName })
      setActiveScreen('reviewReplaceOwner')
    }
  }

  const onReplaceOwner = async (txParameters: TxParameters) => {
    onClose()
    try {
      await sendReplaceOwner(newOwner, safeAddress, owner.address, dispatch, txParameters)
      dispatch(addressBookAddOrUpdate(makeAddressBookEntry(newOwner)))
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
          <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} initialValues={newOwner} owner={owner} />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwnerModal
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onReplaceOwner}
            owner={owner}
            newOwner={newOwner}
          />
        )}
      </>
    </Modal>
  )
}
