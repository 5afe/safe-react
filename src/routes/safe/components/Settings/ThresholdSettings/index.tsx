import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  safeOwnersSelector,
  safeParamAddressFromStateSelector,
  safeThresholdSelector,
} from 'src/logic/safe/store/selectors'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

import { ChangeThresholdModal } from './ChangeThreshold'
import { styles } from './style'

const useStyles = makeStyles(styles)

const ThresholdSettings = (): React.ReactElement => {
  const classes = useStyles()
  const [isModalOpen, setModalOpen] = useState(false)
  const threshold = useSelector(safeThresholdSelector) || 1
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const owners = useSelector(safeOwnersSelector)
  const granted = useSelector(grantedSelector)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Settings', label: 'Owners' })
  }, [trackEvent])

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
        <ChangeThresholdModal onClose={toggleModal} owners={owners} safeAddress={safeAddress} threshold={threshold} />
      </Modal>
    </>
  )
}

export default ThresholdSettings
