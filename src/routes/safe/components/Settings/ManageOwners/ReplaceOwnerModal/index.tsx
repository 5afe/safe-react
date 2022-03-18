import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { checksumAddress } from 'src/utils/checksumAddress'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

import { OwnerForm } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/OwnerForm'
import { ReviewReplaceOwnerModal } from 'src/routes/safe/components/Settings/ManageOwners/ReplaceOwnerModal/screens/Review'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { isValidAddress } from 'src/utils/isValidAddress'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'
import { extractSafeAddress } from 'src/routes/routes'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { _getChainId } from 'src/config'

export type OwnerValues = {
  address: string
  name: string
}

export const sendReplaceOwner = async (
  newOwner: OwnerValues,
  safeAddress: string,
  safeVersion: string,
  ownerAddressToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
  connectedWalletAddress: string,
  delayExecution: boolean,
): Promise<void> => {
  const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
  const safeTx = await sdk.getSwapOwnerTx(
    { oldOwnerAddress: ownerAddressToRemove, newOwnerAddress: newOwner.address },
    { safeTxGas: 0 },
  )
  const txData = safeTx.data.data

  await dispatch(
    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: '0',
      txData,
      txNonce: txParameters.safeNonce,
      safeTxGas: txParameters.safeTxGas,
      ethParameters: txParameters,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      delayExecution,
    }),
  )
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
  const safeAddress = extractSafeAddress()
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const connectedWalletAddress = useSelector(userAccountSelector)

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

  const onReplaceOwner = async (txParameters: TxParameters, delayExecution: boolean) => {
    onClose()

    try {
      await sendReplaceOwner(
        newOwner,
        safeAddress,
        safeVersion,
        owner.address,
        dispatch,
        txParameters,
        connectedWalletAddress,
        delayExecution,
      )
      dispatch(addressBookAddOrUpdate(makeAddressBookEntry({ ...newOwner, chainId: _getChainId() })))
    } catch (error) {
      logError(Errors._810, error.message)
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
