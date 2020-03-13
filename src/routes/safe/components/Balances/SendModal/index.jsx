// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { List } from 'immutable'
import React, { Suspense, useEffect, useState } from 'react'

import Modal from '~/components/Modal'
import { type Token } from '~/logic/tokens/store/model/token'
import type { NFTToken } from '~/routes/safe/components/Balances/Collectibles/types'
import ReviewCollectible from '~/routes/safe/components/Balances/SendModal/screens/ReviewCollectible'
import SendCollectible from '~/routes/safe/components/Balances/SendModal/screens/SendCollectible'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

// const SendCollectible = React.lazy(() => import('./screens/SendCollectible'))

// const ReviewCollectible = React.lazy(() => import('./screens/ReviewCollectible'))

const ReviewTx = React.lazy(() => import('./screens/ReviewTx'))

const SendCustomTx = React.lazy(() => import('./screens/SendCustomTx'))

const ReviewCustomTx = React.lazy(() => import('./screens/ReviewCustomTx'))

type ActiveScreen =
  | 'chooseTxType'
  | 'sendFunds'
  | 'reviewTx'
  | 'sendCustomTx'
  | 'reviewCustomTx'
  | 'sendCollectible'
  | 'reviewCollectible'

type Props = {
  onClose: () => void,
  isOpen: boolean,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  tokens: List<Token>,
  selectedToken?: string | NFTToken | {},
  createTransaction?: Function,
  activeScreenType: ActiveScreen,
  recipientAddress?: string,
}

type TxStateType =
  | {
      token: Token,
      recipientAddress: string,
      amount: string,
      data: string,
    }
  | Object

const useStyles = makeStyles({
  scalableModalWindow: {
    height: 'auto',
  },
  scalableStaticModalWindow: {
    height: 'auto',
    position: 'static',
  },
  loaderStyle: {
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const SendModal = ({
  activeScreenType,
  createTransaction,
  ethBalance,
  isOpen,
  onClose,
  recipientAddress,
  safeAddress,
  safeName,
  selectedToken,
  tokens,
}: Props) => {
  const classes = useStyles()
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState<TxStateType>({})

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setTx({})
  }, [isOpen])

  const scalableModalSize = activeScreen === 'chooseTxType'

  const handleTxCreation = txInfo => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }

  const handleCustomTxCreation = customTxInfo => {
    setActiveScreen('reviewCustomTx')
    setTx(customTxInfo)
  }

  const handleSendCollectible = txInfo => {
    setActiveScreen('reviewCollectible')
    setTx(txInfo)
  }

  return (
    <Modal
      description="Send Tokens Form"
      handleClose={onClose}
      open={isOpen}
      paperClassName={cn(scalableModalSize ? classes.scalableStaticModalWindow : classes.scalableModalWindow)}
      title="Send Tokens"
    >
      <Suspense
        fallback={
          <div className={classes.loaderStyle}>
            <CircularProgress size={40} />
          </div>
        }
      >
        {activeScreen === 'chooseTxType' && <ChooseTxType onClose={onClose} setActiveScreen={setActiveScreen} />}
        {activeScreen === 'sendFunds' && (
          <SendFunds
            ethBalance={ethBalance}
            initialValues={tx}
            onClose={onClose}
            onSubmit={handleTxCreation}
            recipientAddress={recipientAddress}
            safeAddress={safeAddress}
            safeName={safeName}
            selectedToken={selectedToken}
            tokens={tokens}
          />
        )}
        {activeScreen === 'reviewTx' && (
          <ReviewTx
            createTransaction={createTransaction}
            ethBalance={ethBalance}
            onClose={onClose}
            safeAddress={safeAddress}
            safeName={safeName}
            setActiveScreen={setActiveScreen}
            tokens={tokens}
            tx={tx}
          />
        )}
        {activeScreen === 'sendCustomTx' && (
          <SendCustomTx
            ethBalance={ethBalance}
            initialValues={tx}
            onClose={onClose}
            onSubmit={handleCustomTxCreation}
            safeAddress={safeAddress}
            safeName={safeName}
          />
        )}
        {activeScreen === 'reviewCustomTx' && (
          <ReviewCustomTx
            createTransaction={createTransaction}
            ethBalance={ethBalance}
            onClose={onClose}
            safeAddress={safeAddress}
            safeName={safeName}
            setActiveScreen={setActiveScreen}
            tx={tx}
          />
        )}
        {activeScreen === 'sendCollectible' && (
          <SendCollectible
            initialValues={tx}
            onClose={onClose}
            onNext={handleSendCollectible}
            recipientAddress={recipientAddress}
            selectedToken={selectedToken}
          />
        )}
        {activeScreen === 'reviewCollectible' && (
          <ReviewCollectible onClose={onClose} onPrev={() => setActiveScreen('sendCollectible')} tx={tx} />
        )}
      </Suspense>
    </Modal>
  )
}

export default SendModal
