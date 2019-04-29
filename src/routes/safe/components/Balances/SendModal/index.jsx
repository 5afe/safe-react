// @flow
import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import ChooseTxType from './screens/ChooseTxType'
import SendFunds from './screens/SendFunds'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
}
type ActiveScreen = 'chooseTxType' | 'sendFunds'

const styles = () => ({
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})

const Send = ({ onClose, isOpen, classes }: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('chooseTxType')
  const smallerModalSize = activeScreen === 'chooseTxType'

  useEffect(
    () => () => {
      setActiveScreen('chooseTxType')
    },
    [isOpen],
  )

  return (
    <Modal
      title="Send Tokens"
      description="Send Tokens Form"
      handleClose={onClose}
      open={isOpen}
      paperClassName={cn(smallerModalSize && classes.smallerModalWindow)}
    >
      <React.Fragment>
        {activeScreen === 'chooseTxType' && <ChooseTxType onClose={onClose} setActiveScreen={setActiveScreen} />}
        {activeScreen === 'sendFunds' && <SendFunds onClose={onClose} setActiveScreen={setActiveScreen} />}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(Send)
