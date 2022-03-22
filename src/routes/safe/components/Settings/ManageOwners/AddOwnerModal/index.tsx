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
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { extractSafeAddress } from 'src/routes/routes'

import { OwnerForm } from './screens/OwnerForm'
import { ReviewAddOwner } from './screens/Review'
import { ThresholdForm } from './screens/ThresholdForm'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { currentChainId } from 'src/logic/config/store/selectors'

export type OwnerValues = {
  ownerAddress: string
  ownerName: string
  threshold: string
}

export const sendAddOwner = async (
  values: OwnerValues,
  safeAddress: string,
  safeVersion: string,
  txParameters: TxParameters,
  dispatch: Dispatch,
  connectedWalletAddress: string,
  delayExecution: boolean,
): Promise<void> => {
  const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
  const safeTx = await sdk.getAddOwnerTx(
    { ownerAddress: values.ownerAddress, threshold: +values.threshold },
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

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AddOwnerModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('selectOwner')
  const [values, setValues] = useState<OwnerValues>({ ownerName: '', ownerAddress: '', threshold: '' })
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const connectedWalletAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)

  useEffect(
    () => () => {
      setActiveScreen('selectOwner')
      setValues({ ownerName: '', ownerAddress: '', threshold: '' })
    },
    [isOpen],
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewAddOwner') {
      setActiveScreen('selectThreshold')
    } else if (activeScreen === 'selectThreshold') {
      setActiveScreen('selectOwner')
    }
  }

  const ownerSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      ownerName: newValues.ownerName,
      ownerAddress: checksumAddress(newValues.ownerAddress),
    }))
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      threshold: newValues.threshold,
    }))
    setActiveScreen('reviewAddOwner')
  }

  const onAddOwner = async (txParameters: TxParameters, delayExecution: boolean) => {
    onClose()

    try {
      await sendAddOwner(
        values,
        safeAddress,
        safeVersion,
        txParameters,
        dispatch,
        connectedWalletAddress,
        delayExecution,
      )
      dispatch(
        addressBookAddOrUpdate(makeAddressBookEntry({ name: values.ownerName, address: values.ownerAddress, chainId })),
      )
    } catch (error) {
      logError(Errors._808, error.message)
    }
  }

  return (
    <Modal
      description="Add owner to Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="bigger-modal-window"
      title="Add owner to Safe"
    >
      <>
        {activeScreen === 'selectOwner' && (
          <OwnerForm initialValues={values} onClose={onClose} onSubmit={ownerSubmitted} />
        )}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClickBack={onClickBack}
            initialValues={{ threshold: values.threshold }}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner onClickBack={onClickBack} onClose={onClose} onSubmit={onAddOwner} values={values} />
        )}
      </>
    </Modal>
  )
}
