import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { CheckOwner } from './screens/CheckOwner'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { ReviewRemoveOwnerModal } from './screens/Review'
import { ThresholdForm } from './screens/ThresholdForm'

import Modal from 'src/components/Modal'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { extractSafeAddress } from 'src/routes/routes'
import { getSafeSDK } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentSafe, currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { trackEvent } from 'src/utils/googleTagManager'
import { SETTINGS_EVENTS } from 'src/utils/events/settings'
import { store } from 'src/store'

type OwnerValues = OwnerData & {
  threshold: string
}

export const sendRemoveOwner = async (
  values: OwnerValues,
  safeAddress: string,
  safeVersion: string,
  ownerAddressToRemove: string,
  dispatch: Dispatch,
  txParameters: TxParameters,
  connectedWalletAddress: string,
  delayExecution: boolean,
): Promise<void> => {
  const sdk = await getSafeSDK(connectedWalletAddress, safeAddress, safeVersion)
  const safeTx = await sdk.getRemoveOwnerTx(
    { ownerAddress: ownerAddressToRemove, threshold: +values.threshold },
    { safeTxGas: 0 },
  )
  const txData = safeTx.data.data

  dispatch(
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

  trackEvent({ ...SETTINGS_EVENTS.THRESHOLD.THRESHOLD, label: values.threshold })
  trackEvent({ ...SETTINGS_EVENTS.THRESHOLD.OWNERS, label: currentSafe(store.getState()).owners.length })
}

type RemoveOwnerProps = {
  isOpen: boolean
  onClose: () => void
  owner: OwnerData
}

export const RemoveOwnerModal = ({ isOpen, onClose, owner }: RemoveOwnerProps): React.ReactElement => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState<OwnerValues>({ ...owner, threshold: '' })
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const safeVersion = useSelector(currentSafeCurrentVersion)
  const connectedWalletAddress = useSelector(userAccountSelector)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
    },
    [isOpen],
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewRemoveOwner') {
      setActiveScreen('selectThreshold')
    } else if (activeScreen === 'selectThreshold') {
      setActiveScreen('checkOwner')
    }
  }

  const ownerSubmitted = () => {
    setActiveScreen('selectThreshold')
  }

  const thresholdSubmitted = (newValues) => {
    const cpValues = { ...values, threshold: newValues.threshold }
    setValues(cpValues)
    setActiveScreen('reviewRemoveOwner')
  }

  const onRemoveOwner = async (txParameters: TxParameters, delayExecution: boolean) => {
    onClose()

    try {
      await sendRemoveOwner(
        values,
        safeAddress,
        safeVersion,
        owner.address,
        dispatch,
        txParameters,
        connectedWalletAddress,
        delayExecution,
      )
    } catch (error) {
      logError(Errors._809, error.message)
    }
  }

  return (
    <Modal
      description="Remove owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="bigger-modal-window"
      title="Remove owner from Safe"
    >
      <>
        {activeScreen === 'checkOwner' && <CheckOwner onClose={onClose} onSubmit={ownerSubmitted} owner={owner} />}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm
            onClickBack={onClickBack}
            initialValues={{ threshold: values.threshold }}
            onClose={onClose}
            onSubmit={thresholdSubmitted}
          />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwnerModal
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onRemoveOwner}
            owner={owner}
            threshold={Number(values.threshold)}
          />
        )}
      </>
    </Modal>
  )
}
