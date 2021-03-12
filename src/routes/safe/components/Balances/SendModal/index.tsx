import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { Suspense, lazy, useEffect, useState } from 'react'

import Modal from 'src/components/Modal'
import { CollectibleTx } from './screens/ReviewCollectible'
import { CustomTx } from './screens/ContractInteraction/ReviewCustomTx'
import { ContractInteractionTx } from './screens/ContractInteraction'
import { CustomTxProps } from './screens/ContractInteraction/SendCustomTx'
import { ReviewTxProp } from './screens/ReviewTx'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'
import { SendCollectibleTxInfo } from './screens/SendCollectible'

const ChooseTxType = lazy(() => import('./screens/ChooseTxType'))

const SendFunds = lazy(() => import('./screens/SendFunds'))

const SendCollectible = lazy(() => import('./screens/SendCollectible'))

const ReviewCollectible = lazy(() => import('./screens/ReviewCollectible'))

const ReviewTx = lazy(() => import('./screens/ReviewTx'))

const ContractInteraction = lazy(() => import('./screens/ContractInteraction'))

const ContractInteractionReview: any = React.lazy(() => import('./screens/ContractInteraction/Review'))

const SendCustomTx = lazy(() => import('./screens/ContractInteraction/SendCustomTx'))

const ReviewCustomTx = lazy(() => import('./screens/ContractInteraction/ReviewCustomTx'))

const useStyles = makeStyles({
  scalableModalWindow: {
    height: 'auto',
  },
  scalableStaticModalWindow: {
    height: 'auto',
  },
  loaderStyle: {
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type Props = {
  activeScreenType: string
  isOpen: boolean
  onClose: () => void
  recipientAddress?: string
  selectedToken?: string | NFTToken
  tokenAmount?: string
}

const SendModal = ({
  activeScreenType,
  isOpen,
  onClose,
  recipientAddress,
  selectedToken,
  tokenAmount,
}: Props): React.ReactElement => {
  const classes = useStyles()
  const [activeScreen, setActiveScreen] = useState(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState<unknown>({})
  const [isABI, setIsABI] = useState(true)

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setIsABI(true)
    setTx({})
  }, [activeScreenType, isOpen])

  const scalableModalSize = activeScreen === 'chooseTxType'

  const handleTxCreation = (txInfo: SendCollectibleTxInfo) => {
    setActiveScreen('reviewTx')
    setTx(txInfo)
  }

  const handleContractInteractionCreation = (contractInteractionInfo: any, submit: boolean): void => {
    setTx(contractInteractionInfo)
    if (submit) setActiveScreen('contractInteractionReview')
  }

  const handleCustomTxCreation = (customTxInfo: any, submit: boolean): void => {
    setTx(customTxInfo)
    if (submit) setActiveScreen('reviewCustomTx')
  }

  const handleSendCollectible = (txInfo) => {
    setActiveScreen('reviewCollectible')
    setTx(txInfo)
  }

  const handleSwitchMethod = (): void => {
    setIsABI(!isABI)
  }

  return (
    <Suspense
      fallback={
        <div className={classes.loaderStyle}>
          <CircularProgress size={40} />
        </div>
      }
    >
      <Modal
        description="Send Tokens Form"
        handleClose={onClose}
        open={isOpen}
        paperClassName={cn(scalableModalSize ? classes.scalableStaticModalWindow : classes.scalableModalWindow)}
        title="Send Tokens"
      >
        {activeScreen === 'chooseTxType' && (
          <ChooseTxType onClose={onClose} recipientAddress={recipientAddress} setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 'sendFunds' && (
          <SendFunds
            onClose={onClose}
            onNext={handleTxCreation}
            recipientAddress={recipientAddress}
            selectedToken={selectedToken as string}
            amount={tokenAmount}
          />
        )}
        {activeScreen === 'reviewTx' && (
          <ReviewTx onClose={onClose} onPrev={() => setActiveScreen('sendFunds')} tx={tx as ReviewTxProp} />
        )}
        {activeScreen === 'contractInteraction' && isABI && (
          <ContractInteraction
            isABI={isABI}
            switchMethod={handleSwitchMethod}
            contractAddress={recipientAddress}
            initialValues={tx as ContractInteractionTx}
            onClose={onClose}
            onNext={handleContractInteractionCreation}
          />
        )}
        {activeScreen === 'contractInteractionReview' && isABI && tx && (
          <ContractInteractionReview onClose={onClose} onPrev={() => setActiveScreen('contractInteraction')} tx={tx} />
        )}
        {activeScreen === 'contractInteraction' && !isABI && (
          <SendCustomTx
            initialValues={tx as CustomTxProps}
            isABI={isABI}
            switchMethod={handleSwitchMethod}
            onClose={onClose}
            onNext={handleCustomTxCreation}
            contractAddress={recipientAddress}
          />
        )}
        {activeScreen === 'reviewCustomTx' && (
          <ReviewCustomTx onClose={onClose} onPrev={() => setActiveScreen('contractInteraction')} tx={tx as CustomTx} />
        )}
        {activeScreen === 'sendCollectible' && (
          <SendCollectible
            initialValues={tx}
            onClose={onClose}
            onNext={handleSendCollectible}
            recipientAddress={recipientAddress}
            selectedToken={selectedToken as NFTToken | undefined}
          />
        )}
        {activeScreen === 'reviewCollectible' && (
          <ReviewCollectible
            onClose={onClose}
            onPrev={() => setActiveScreen('sendCollectible')}
            tx={tx as CollectibleTx}
          />
        )}
      </Modal>
    </Suspense>
  )
}

export default SendModal
