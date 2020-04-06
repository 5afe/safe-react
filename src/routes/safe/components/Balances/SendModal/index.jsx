// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { Suspense, useEffect, useState } from 'react'

import Modal from '~/components/Modal'
import { type Token } from '~/logic/tokens/store/model/token'
import type { NFTToken } from '~/routes/safe/components/Balances/Collectibles/types'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

const SendCollectible = React.lazy(() => import('./screens/SendCollectible'))

const ReviewCollectible = React.lazy(() => import('./screens/ReviewCollectible'))

const ReviewTx = React.lazy(() => import('./screens/ReviewTx'))

const ContractInteraction = React.lazy(() => import('./screens/ContractInteraction'))

const ContractInteractionReview = React.lazy(() => import('./screens/ContractInteractionReview'))

type ActiveScreen =
  | 'chooseTxType'
  | 'sendFunds'
  | 'reviewTx'
  | 'contractInteraction'
  | 'contractInteractionReview'
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

  const handleContractInteractionCreation = (contractInteractionInfo) => {
    setActiveScreen('contractInteractionReview')
    setTx(contractInteractionInfo)
  }

  const handleSendCollectible = (txInfo) => {
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
        {activeScreen === 'contractInteraction' && (
          <ContractInteraction
            initialValues={tx}
            onClose={onClose}
            onNext={handleContractInteractionCreation}
            recipientAddress={recipientAddress}
          />
        )}
        {activeScreen === 'contractInteractionReview' && (
          <ContractInteractionReview onClose={onClose} onPrev={() => setActiveScreen('contractInteraction')} tx={tx} />
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
