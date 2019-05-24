// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import ChooseTxType from './screens/ChooseTxType'
import SendFunds from './screens/SendFunds'
import ReviewTx from './screens/ReviewTx'

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
}
type ActiveScreen = 'chooseTxType' | 'sendFunds' | 'reviewTx'

type TxStateType =
  | {
      token: Token,
      recipientAddress: string,
      amount: string,
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
}: Props) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('sendFunds')
  const [tx, setTx] = useState<TxStateType>({})
  const smallerModalSize = activeScreen === 'chooseTxType'
  const handleTxCreation = (txInfo) => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }
  const onClickBack = () => setActiveScreen('sendFunds')

  useEffect(
    () => () => {
      setActiveScreen('sendFunds')
      setTx({})
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
            onSubmit={handleTxCreation}
            initialValues={tx}
          />
        )}
        {activeScreen === 'reviewTx' && (
          <ReviewTx
            tx={tx}
            onClose={onClose}
            safeAddress={safeAddress}
            etherScanLink={etherScanLink}
            safeName={safeName}
            ethBalance={ethBalance}
            onClickBack={onClickBack}
            createTransaction={createTransaction}
          />
        )}
      </React.Fragment>
    </Modal>
  )
}

export default withStyles(styles)(Send)
