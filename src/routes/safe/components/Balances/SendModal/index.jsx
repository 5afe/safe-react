// @flow
import React, { useState, useEffect, Suspense } from 'react'
import { List } from 'immutable'
import CircularProgress from '@material-ui/core/CircularProgress'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { type Token } from '~/logic/tokens/store/model/token'
import Modal from '~/components/Modal'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

const ReviewTx = React.lazy(() => import('./screens/ReviewTx'))

const SendCustomTx = React.lazy(() => import('./screens/SendCustomTx'))

const ReviewCustomTx = React.lazy(() => import('./screens/ReviewCustomTx'))

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
  activeScreenType: ActiveScreen,
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

const loaderStyle = {
  height: '500px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

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
      paperClassName={cn(scalableModalSize ? classes.scalableStaticModalWindow : classes.scalableModalWindow)}
    >
      <Suspense
        fallback={(
          <div style={loaderStyle}>
            <CircularProgress size={40} />
          </div>
        )}
      >
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
      </Suspense>
    </Modal>
  )
}

export default withStyles(styles)(Send)
