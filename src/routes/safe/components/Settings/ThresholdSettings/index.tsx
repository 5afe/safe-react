import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { grantedSelector } from 'src/routes/safe/container/selector'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import {
  safeOwnersSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EditTxParametersForm } from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'

import { ChangeThresholdModal } from './ChangeThreshold'
import { styles } from './style'

const useStyles = makeStyles(styles)

const ThresholdSettings = (): React.ReactElement => {
  const classes = useStyles()
  const [isModalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const threshold = useSelector(safeThresholdSelector) || 1
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const owners = useSelector(safeOwnersSelector)
  const granted = useSelector(grantedSelector)
  const txParameters = useTransactionParameters()
  const [activeScreen, setActiveScreen] = useState('form')

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const onChangeThreshold = async (newThreshold: number) => {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    const txData = safeInstance.methods.changeThreshold(newThreshold).encodeABI()

    dispatch(
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
  }

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Settings', label: 'Owners' })
  }, [trackEvent])

  const closeEditTxParameters = () => setActiveScreen('form')

  const getParametersStatus = () => (threshold > 1 ? 'ETH_DISABLED' : 'ENABLED')

  return (
    <>
      <Block className={classes.container}>
        <Heading tag="h2">Required confirmations</Heading>
        <Paragraph>Any transaction requires the confirmation of:</Paragraph>
        <Paragraph className={classes.ownersText} size="lg">
          <Bold>{threshold}</Bold> out of <Bold>{owners?.size || 0}</Bold> owners
        </Paragraph>
        {owners && owners.size > 1 && granted && (
          <Row className={classes.buttonRow}>
            <Button
              className={classes.modifyBtn}
              color="primary"
              minWidth={120}
              onClick={toggleModal}
              variant="contained"
            >
              Modify
            </Button>
          </Row>
        )}
      </Block>
      <Modal
        description="Change Required Confirmations Form"
        handleClose={toggleModal}
        open={isModalOpen}
        title="Change Required Confirmations"
      >
        {activeScreen === 'form' && (
          <ChangeThresholdModal
            onChangeThreshold={onChangeThreshold}
            onClose={toggleModal}
            owners={owners}
            safeAddress={safeAddress}
            threshold={threshold}
          />
        )}
        {activeScreen === 'editTxParameters' && (
          <EditTxParametersForm
            txParameters={txParameters}
            onClose={closeEditTxParameters}
            parametersStatus={getParametersStatus()}
          />
        )}
      </Modal>
    </>
  )
}

export default ThresholdSettings
