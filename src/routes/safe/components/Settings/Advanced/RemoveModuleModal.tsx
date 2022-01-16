import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { getDisableModuleTxData } from 'src/logic/safe/utils/modules'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { ModulePair } from 'src/logic/safe/store/models/safe'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { TxParamsState } from 'src/routes/safe/components/Transactions/helpers/TxParamsState'

import { useStyles } from './style'

interface RemoveModuleModalProps {
  onClose: () => void
  selectedModulePair: ModulePair
}

export const RemoveModuleModal = ({ onClose, selectedModulePair }: RemoveModuleModalProps): ReactElement => {
  const classes = useStyles()

  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe)
  const [txData, setTxData] = useState('')
  const dispatch = useDispatch()
  const [, moduleAddress] = selectedModulePair

  useEffect(() => {
    const txData = getDisableModuleTxData(selectedModulePair, safeAddress, safeVersion)
    setTxData(txData)
  }, [selectedModulePair, safeAddress, safeVersion])

  const removeSelectedModule = async (txParameters: TxParameters): Promise<void> => {
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
        }),
      )
    } catch (e) {
      logError(Errors._806, `${selectedModulePair} – ${e.message}`)
    }
  }

  return (
    <Modal
      description="Remove the selected Module"
      handleClose={onClose}
      paperClassName="modal"
      title="Remove Module"
      open
    >
      <TxParamsState txData={txData} onSubmit={removeSelectedModule} submitText="Remove">
        <ModalHeader onClose={onClose} title="Remove Guard" />
        <Hairline />
        <Block>
          <Row className={classes.modalOwner}>
            <Col align="center" xs={1}>
              <PrefixedEthHashInfo
                hash={moduleAddress}
                showCopyBtn
                showAvatar
                explorerUrl={getExplorerInfo(moduleAddress)}
              />
            </Col>
          </Row>
          <Row className={classes.modalDescription}>
            <Paragraph noMargin size="lg">
              After removing this module, any feature or app that uses this module might no longer work. If this Safe
              requires more then one signature, the module removal will have to be confirmed by other owners as well.
            </Paragraph>
          </Row>
        </Block>
      </TxParamsState>
    </Modal>
  )
}
