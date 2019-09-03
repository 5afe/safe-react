// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
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

type Props = {
  owners: List<Owner>,
  threshold: number,
  classes: Object,
  createTransaction: Function,
  safeAddress: string,
  granted: Boolean,
}

const ThresholdSettings = ({
  owners, threshold, classes, createTransaction, safeAddress, granted,
}: Props) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  return (
    <>
      <SharedSnackbarConsumer>
        {({ openSnackbar }) => {
          const onChangeThreshold = async (newThreshold) => {
            const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
            const txData = safeInstance.contract.methods.changeThreshold(newThreshold).encodeABI()

            createTransaction(safeAddress, safeAddress, 0, txData, openSnackbar)
          }

          return (
            <>
              <Block className={classes.container}>
                <Heading tag="h3">Required confirmations</Heading>
                <Paragraph>
                  Any transaction requires the confirmation of:
                </Paragraph>
                <Paragraph size="lg" className={classes.ownersText}>
                  <Bold>{threshold}</Bold>
                  {' '}
                  out of
                  {' '}
                  <Bold>{owners.size}</Bold>
                  {' '}
                  owners
                </Paragraph>
                {owners.size > 1 && granted && (
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
                )}
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
            </>
          )
        }}
      </SharedSnackbarConsumer>
    </>
  )
}

export default withStyles(styles)(ThresholdSettings)
