import { ReactElement, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { getRemoveGuardTxData } from 'src/logic/safe/utils/guardManager'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { useStyles } from './style'

interface RemoveGuardModalProps {
  onClose: () => void
  guardAddress: string
}

export const RemoveGuardModal = ({ onClose, guardAddress }: RemoveGuardModalProps): ReactElement => {
  const classes = useStyles()

  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe)
  const dispatch = useDispatch()

  const txData = useMemo(() => getRemoveGuardTxData(safeAddress, safeVersion), [safeAddress, safeVersion])

  const removeTransactionGuard = async (txParameters: TxParameters, delayExecution: boolean): Promise<void> => {
    try {
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
    } catch (e) {
      logError(Errors._807, `${guardAddress} – ${e.message}`)
    }
  }

  return (
    <Modal
      description="Remove the selected Transaction Guard"
      handleClose={onClose}
      paperClassName="modal"
      title="Remove Transaction Guard"
      open
    >
      <TxModalWrapper txData={txData} onSubmit={removeTransactionGuard} submitText="Remove" onClose={onClose}>
        <ModalHeader onClose={onClose} title="Remove Guard" />
        <Hairline />
        <Block>
          <Row className={classes.modalOwner}>
            <Col align="center" xs={1}>
              <PrefixedEthHashInfo
                hash={guardAddress}
                showCopyBtn
                showAvatar
                explorerUrl={getExplorerInfo(guardAddress)}
              />
            </Col>
          </Row>
          <Row className={classes.modalDescription}>
            <Paragraph noMargin size="lg">
              Once the transaction guard has been removed, checks by the transaction guard will not be conducted before
              or after any subsequent transactions.
            </Paragraph>
          </Row>
        </Block>
      </TxModalWrapper>
    </Modal>
  )
}
