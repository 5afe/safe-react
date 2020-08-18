import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChangeThreshold from './ChangeThreshold'
import { styles } from './style'

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

const ThresholdSettings = ({ classes, closeSnackbar, enqueueSnackbar }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const threshold = useSelector(safeThresholdSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const owners = useSelector(safeOwnersSelector)
  const granted = useSelector(grantedSelector)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const onChangeThreshold = async (newThreshold) => {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    const txData = safeInstance.methods.changeThreshold(newThreshold).encodeABI()

    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        txData,
        notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
        enqueueSnackbar,
        closeSnackbar,
      } as any),
    )
  }

  return (
    <>
      <Block className={classes.container}>
        <Heading tag="h2">Required confirmations</Heading>
        <Paragraph>Any transaction requires the confirmation of:</Paragraph>
        <Paragraph className={classes.ownersText} size="lg">
          <Bold>{threshold}</Bold> out of <Bold>{owners.size}</Bold> owners
        </Paragraph>
        {owners.size > 1 && granted && (
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
        <ChangeThreshold
          onChangeThreshold={onChangeThreshold}
          onClose={toggleModal}
          owners={owners}
          safeAddress={safeAddress}
          threshold={threshold}
        />
      </Modal>
    </>
  )
}

export default withStyles(styles as any)(withSnackbar(ThresholdSettings))
