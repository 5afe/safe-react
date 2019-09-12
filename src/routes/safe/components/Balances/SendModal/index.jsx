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
import ReviewCustomTx from './screens/ReviewCustomTx'

type ActiveScreen = 'chooseTxType' | 'sendFunds' | 'reviewTx' | 'sendCustomTx' | 'reviewCustomTx'

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
  activeScreenType: ActiveScreen
}

type TxStateType =
  | {
      token: Token,
      recipientAddress: string,
      amount: string,
      data: string,
    }
  | Object

const styles = () => ({
  scalableModalWindow: {
    height: 'auto',
  },
  scalableStaticModalWindow: {
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

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setTx({})
  }, [isOpen])

  const scalableModalSize = activeScreen === 'chooseTxType'

  const handleTxCreation = (txInfo) => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }

  const handleCustomTxCreation = (customTxInfo) => {
    setActiveScreen('reviewCustomTx')
    setTx(customTxInfo)
  }

  return (
    <Modal
      title="Send Tokens"
      description="Send Tokens Form"
      handleClose={onClose}
      open={isOpen}
      paperClassName={cn(
        scalableModalSize ? classes.scalableStaticModalWindow : classes.scalableModalWindow,
      )}
    >
      <>
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
        {activeScreen === 'reviewCustomTx' && (
          <ReviewCustomTx
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
      </>
    </Modal>
  )
}

export default withStyles(styles)(Send)
