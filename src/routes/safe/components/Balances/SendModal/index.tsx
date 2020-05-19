import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { Suspense, useEffect, useState } from 'react'

import Modal from 'src/components/Modal'
import {} from 'src/logic/tokens/store/model/token'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

const SendCollectible = React.lazy(() => import('./screens/SendCollectible'))

const ReviewCollectible = React.lazy(() => import('./screens/ReviewCollectible'))

const ReviewTx = React.lazy(() => import('./screens/ReviewTx'))

const ContractInteraction = React.lazy(() => import('./screens/ContractInteraction'))

const ContractInteractionReview: any = React.lazy(() => import('./screens/ContractInteraction/Review'))

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

const SendModal = ({ activeScreenType, isOpen, onClose, recipientAddress, selectedToken }: any) => {
  const classes = useStyles()
  const [activeScreen, setActiveScreen] = useState(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState({})

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setTx({})
  }, [activeScreenType, isOpen])

  const scalableModalSize = activeScreen === 'chooseTxType'

  const handleTxCreation = (txInfo) => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }

  const handleContractInteractionCreation = (contractInteractionInfo) => {
    setTx(contractInteractionInfo)
    setActiveScreen('contractInteractionReview')
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
            contractAddress={recipientAddress}
            initialValues={tx}
            onClose={onClose}
            onNext={handleContractInteractionCreation}
          />
        )}
        {activeScreen === 'contractInteractionReview' && tx && (
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
