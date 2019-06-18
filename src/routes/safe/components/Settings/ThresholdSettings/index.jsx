// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import Heading from '~/components/layout/Heading'
import Button from '~/components/layout/Button'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Modal from '~/components/Modal'
import Paragraph from '~/components/layout/Paragraph'
import ChangeThreshold from './ChangeThreshold'
import type { Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

type Props = {
  owners: List<Owner>,
  threshold: number,
  classes: Object,
  createTransaction: Function,
  safeAddress: string,
}

const ThresholdSettings = ({
  owners, threshold, classes, createTransaction, safeAddress,
}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen(prevOpen => !prevOpen)
  }

  const onChangeThreshold = async (newThreshold) => {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    const data = safeInstance.contract.changeThreshold(newThreshold).encodeABI()

    createTransaction(safeInstance, safeAddress, 0, ZERO_ADDRESS)
  }

  return (
    <React.Fragment>
      <Block className={classes.container}>
        <Heading tag="h3">Required confirmations</Heading>
        <Paragraph>
          Any transaction over any daily limit
          <br />
          {' '}
requires the confirmation of:
        </Paragraph>
        <Paragraph size="xxl" className={classes.ownersText}>
          <Bold>{threshold}</Bold>
          {' '}
out of
          <Bold>{owners.size}</Bold>
          {' '}
owners
        </Paragraph>
        <Row align="center" className={classes.buttonRow}>
          <Button
            color="primary"
            minWidth={120}
            className={classes.modifyBtn}
            onClick={toggleModal}
            variant="contained"
          >
            Modify
          </Button>
        </Row>
      </Block>
      <Modal
        title="Change Required Confirmations"
        description="Change Required Confirmations Form"
        handleClose={toggleModal}
        open={isModalOpen}
      >
        <ChangeThreshold
          onClose={toggleModal}
          owners={owners}
          threshold={threshold}
          onChangeThreshold={onChangeThreshold}
        />
      </Modal>
    </React.Fragment>
  )
}

export default withStyles(styles)(ThresholdSettings)
