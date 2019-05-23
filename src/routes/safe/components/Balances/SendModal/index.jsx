// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import ChooseTxType from './screens/ChooseTxType'
import SendFunds from './screens/SendFunds'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
  tokens: List<Token>,
  selectedToken: string,
}
type ActiveScreen = 'chooseTxType' | 'sendFunds'

const styles = () => ({
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})

const Send = ({
  onClose, isOpen, classes, safeAddress, etherScanLink, safeName, ethBalance, tokens, selectedToken,
}: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('sendFunds')
  const smallerModalSize = activeScreen === 'chooseTxType'

  // Uncomment when we add custom txs
  // useEffect(
  //   () => () => {
  //     setActiveScreen('chooseTxType')
  //   },
  //   [isOpen],
  // )

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
        {activeScreen === 'sendFunds' && (
          <SendFunds
            onClose={onClose}
            setActiveScreen={setActiveScreen}
            safeAddress={safeAddress}
            etherScanLink={etherScanLink}
            safeName={safeName}
            ethBalance={ethBalance}
            tokens={tokens}
            selectedToken={selectedToken}
          />
        )}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(Send)
