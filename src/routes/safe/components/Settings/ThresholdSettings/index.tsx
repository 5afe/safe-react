import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { currentSafe } from 'src/logic/safe/store/selectors'

import { ChangeThresholdModal } from './ChangeThreshold'
import { styles } from './style'
import { SETTINGS_EVENTS } from 'src/utils/events/settings'
import Track from 'src/components/Track'

const useStyles = makeStyles(styles)

const ThresholdSettings = (): React.ReactElement => {
  const classes = useStyles()
  const [isModalOpen, setModalOpen] = useState(false)
  const { address: safeAddress = '', owners, threshold = 1 } = useSelector(currentSafe) ?? {}
  const granted = useSelector(grantedSelector)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  return (
    <>
      <Block className={classes.container}>
        <Heading tag="h2">Required Confirmations</Heading>
        <Paragraph>Any transaction requires the confirmation of:</Paragraph>
        <Paragraph className={classes.ownersText} size="lg">
          <Bold>{threshold}</Bold> out of <Bold>{owners?.length || 0}</Bold> owners
        </Paragraph>
        {owners && owners.length > 1 && granted && (
          <Row className={classes.buttonRow}>
            <Track {...SETTINGS_EVENTS.THRESHOLD.CHANGE}>
              <Button
                className={classes.modifyBtn}
                color="primary"
                minWidth={120}
                onClick={toggleModal}
                variant="contained"
              >
                Change
              </Button>
            </Track>
          </Row>
        )}
      </Block>
      <Modal
        description="Change Required Confirmations Form"
        handleClose={toggleModal}
        open={isModalOpen}
        title="Change Required Confirmations"
      >
        <ChangeThresholdModal
          onClose={toggleModal}
          ownersCount={owners?.length}
          safeAddress={safeAddress}
          threshold={threshold}
        />
      </Modal>
    </>
  )
}

export default ThresholdSettings
