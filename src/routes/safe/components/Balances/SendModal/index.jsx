// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { type Token } from '~/logic/tokens/store/model/token'
import Modal from '~/components/Modal'
import ChooseTxType from './screens/ChooseTxType'
import SendFunds from './screens/SendFunds'
import ReviewTx from './screens/ReviewTx'
import SendCustomTx from './screens/SendCustomTx'

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
  createTransaction: Function,
  activeScreenType: string
}

type ActiveScreen = 'chooseTxType' | 'sendFunds' | 'reviewTx' | 'sendCustomTx' | 'reviewCustomTx'

type TxStateType =
  | {
      token: Token,
      recipientAddress: string,
      amount: string,
      data: string,
    }
  | Object

const styles = () => ({
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})

const Send = ({
  onClose,
  isOpen,
  classes,
  safeAddress,
  etherScanLink,
  safeName,
  ethBalance,
  tokens,
  selectedToken,
  createTransaction,
  activeScreenType,
}: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState<TxStateType>({})
  const smallerModalSize = activeScreen === 'chooseTxType'
  const handleTxCreation = (txInfo) => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }
  const handleCustomTxCreation = (customTxInfo) => {
    setActiveScreen('reviewCustomTx')
    setTx(customTxInfo)
  }

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setTx({})
  }, [isOpen])

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
            safeAddress={safeAddress}
            etherScanLink={etherScanLink}
            safeName={safeName}
            ethBalance={ethBalance}
            tokens={tokens}
            selectedToken={selectedToken}
            onSubmit={handleTxCreation}
            initialValues={tx}
          />
        )}
        {activeScreen === 'reviewTx' && (
          <ReviewTx
            tx={tx}
            onClose={onClose}
            setActiveScreen={setActiveScreen}
            safeAddress={safeAddress}
            etherScanLink={etherScanLink}
            safeName={safeName}
            ethBalance={ethBalance}
            createTransaction={createTransaction}
          />
        )}
        {activeScreen === 'sendCustomTx' && (
          <SendCustomTx
            onClose={onClose}
            safeAddress={safeAddress}
            etherScanLink={etherScanLink}
            safeName={safeName}
            ethBalance={ethBalance}
            onSubmit={handleCustomTxCreation}
            initialValues={tx}
          />
        )}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(Send)
