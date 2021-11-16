import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useStyles } from './style'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import Link from 'src/components/layout/Link'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getUpgradeSafeTransactionHash } from 'src/logic/safe/utils/upgradeSafe'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { ReviewInfoText } from 'src/components/ReviewInfoText'
import { EstimationStatus, useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEstimationStatus } from 'src/logic/hooks/useEstimationStatus'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { TxParametersDetail } from 'src/routes/safe/components/Transactions/helpers/TxParametersDetail'
import { EditableTxParameters } from 'src/routes/safe/components/Transactions/helpers/EditableTxParameters'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'

type Props = {
  onClose: () => void
  safeAddress: string
  safeCurrentVersion: string
}

export const UpdateSafeModal = ({ onClose, safeAddress, safeCurrentVersion }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
    gasPriceFormatted,
    gasLimit,
    gasEstimation,
  } = useEstimateTransactionGas({
    txRecipient: getMultisendContractAddress(),
    txData: multiSendCallData,
    txAmount: '0',
    operation: Operation.DELEGATE,
  })

  const [buttonStatus] = useEstimationStatus(txEstimationExecutionStatus)

  useEffect(() => {
    const encodeMultiSendCallData = getUpgradeSafeTransactionHash(safeAddress, safeCurrentVersion)
    setMultiSendCallData(encodeMultiSendCallData)
  }, [safeAddress, safeCurrentVersion])

  const handleSubmit = (txParameters: TxParameters) => {
    // Call the update safe method
    dispatch(
      createTransaction({
        safeAddress,
        to: getMultisendContractAddress(),
        valueInWei: '0',
        txData: multiSendCallData,
        txNonce: txParameters.safeNonce,
        safeTxGas: txParameters.safeTxGas,
        ethParameters: txParameters,
        notifiedTransaction: 'STANDARD_TX',
        operation: Operation.DELEGATE,
      }),
    )
    onClose()
  }

  let confirmButtonText = 'Update Safe'
  if (ButtonStatus.LOADING === buttonStatus) {
    confirmButtonText = txEstimationExecutionStatus === EstimationStatus.LOADING ? 'Estimating' : 'Updating'
  }

  return (
    <EditableTxParameters
      isOffChainSignature={isOffChainSignature}
      isExecution={isExecution}
      ethGasLimit={gasLimit}
      ethGasPrice={gasPriceFormatted}
      safeTxGas={gasEstimation.toString()}
    >
      {(txParameters, toggleEditMode) => (
        <>
          <ModalHeader onClose={onClose} title="Update safe version" />
          <Block className={classes.modalContent}>
            <Row>
              <Paragraph noMargin>
                Update now to take advantage of new features and the highest security standards available.
              </Paragraph>
              <Paragraph>
                To check details about updates added by this smart contract version please visit{' '}
                <Link
                  target="_blank"
                  to={`https://github.com/gnosis/safe-contracts/releases/tag/v${LATEST_SAFE_VERSION}`}
                >
                  latest Gnosis Safe contracts changelog
                </Link>
              </Paragraph>
              <Paragraph noMargin>
                You will need to confirm this update just like any other transaction. This means other owners will have
                to confirm the update in case more than one confirmation is required for this Safe.
              </Paragraph>

              {/* A warning for 1.x.x -> 1.3.0 upgrades */}
              <Paragraph>
                <b>Warning</b>: this upgrade will invalidate all unexecuted transactions. This means you will be unable
                to access or execute them after the upgrade. Please make sure to execute any remaining transactions
                before upgrading.
              </Paragraph>
            </Row>
            {/* Tx Parameters */}
            <TxParametersDetail
              txParameters={txParameters}
              onEdit={toggleEditMode}
              compact={false}
              isTransactionCreation={isCreation}
              isTransactionExecution={isExecution}
              isOffChainSignature={isOffChainSignature}
            />
          </Block>
          {txEstimationExecutionStatus === EstimationStatus.LOADING ? null : (
            <ReviewInfoText
              gasCostFormatted={gasCostFormatted}
              isCreation={isCreation}
              isExecution={isExecution}
              isOffChainSignature={isOffChainSignature}
              safeNonce={txParameters.safeNonce}
              txEstimationExecutionStatus={txEstimationExecutionStatus}
            />
          )}
          {/* Footer */}
          <Modal.Footer withoutBorder={buttonStatus !== ButtonStatus.LOADING}>
            <Modal.Footer.Buttons
              cancelButtonProps={{
                onClick: onClose,
                text: 'Cancel',
              }}
              confirmButtonProps={{
                onClick: () => handleSubmit(txParameters),
                status: buttonStatus,
                text: confirmButtonText,
              }}
            />
          </Modal.Footer>
        </>
      )}
    </EditableTxParameters>
  )
}
