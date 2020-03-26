// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '~/components/Modal'
import activateTokensByBalance from '~/logic/tokens/store/actions/activateTokensByBalance'
import { type Token } from '~/logic/tokens/store/model/token'
import type { NFTToken } from '~/routes/safe/components/Balances/Collectibles/types'
import { extendedSafeTokensSelector } from '~/routes/safe/container/selector'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import { safeSelector } from '~/routes/safe/store/selectors'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

const SendCollectible = React.lazy(() => import('./screens/SendCollectible'))

const ReviewCollectible = React.lazy(() => import('./screens/ReviewCollectible'))

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
  activeScreenType: ActiveScreen,
  isOpen: boolean,
  onClose: () => void,
  recipientAddress?: string,
  selectedToken?: string | NFTToken | {},
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

const SendModal = ({ activeScreenType, isOpen, onClose, recipientAddress, selectedToken }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const { address } = useSelector(safeSelector)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState<TxStateType>({})

  useEffect(() => {
    dispatch(activateTokensByBalance(address))
  }, [])

  useEffect(() => {
    if (activeTokens.size > 0) {
      dispatch(fetchTokenBalances(address, activeTokens))
    }
  }, [activeTokens.size])

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
        {activeScreen === 'chooseTxType' && (
          <ChooseTxType onClose={onClose} recipientAddress={recipientAddress} setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 'sendFunds' && (
          <SendFunds
            initialValues={tx}
            onClose={onClose}
            onNext={handleTxCreation}
            recipientAddress={recipientAddress}
            selectedToken={selectedToken}
          />
        )}
        {activeScreen === 'reviewTx' && (
          <ReviewTx onClose={onClose} onPrev={() => setActiveScreen('sendFunds')} tx={tx} />
        )}
        {activeScreen === 'sendCustomTx' && (
          <SendCustomTx
            initialValues={tx}
            onClose={onClose}
            onNext={handleCustomTxCreation}
            recipientAddress={recipientAddress}
          />
        )}
        {activeScreen === 'reviewCustomTx' && (
          <ReviewCustomTx onClose={onClose} onPrev={() => setActiveScreen('sendCustomTx')} tx={tx} />
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
