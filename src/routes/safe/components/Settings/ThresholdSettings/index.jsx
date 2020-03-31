// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { withSnackbar } from 'notistack'
import React, { useState } from 'react'

import ChangeThreshold from './ChangeThreshold'
import { styles } from './style'

import Modal from '~/components/Modal'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Button from '~/components/layout/Button'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import type { Owner } from '~/routes/safe/store/models/owner'

type Props = {
  owners: List<Owner>,
  threshold: number,
  classes: Object,
  createTransaction: Function,
  safeAddress: string,
  granted: boolean,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const ThresholdSettings = ({
  classes,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  granted,
  owners,
  safeAddress,
  threshold,
}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const onChangeThreshold = async (newThreshold) => {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    const txData = safeInstance.contract.methods.changeThreshold(newThreshold).encodeABI()

    createTransaction({
      safeAddress,
      to: safeAddress,
      valueInWei: 0,
      txData,
      notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
      enqueueSnackbar,
      closeSnackbar,
    })
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

export default withStyles(styles)(withSnackbar(ThresholdSettings))
