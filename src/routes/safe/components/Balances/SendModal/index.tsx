import { Loader } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React, { Suspense, useEffect, useState } from 'react'

import Modal from 'src/components/Modal'
import { Erc721Transfer } from 'src/logic/safe/store/models/types/gateway'
import { CollectibleTx } from './screens/ReviewCollectible'
import { ReviewCustomTxProps } from './screens/ContractInteraction/ReviewCustomTx'
import { ContractInteractionTx } from './screens/ContractInteraction'
import { CustomTxProps } from './screens/ContractInteraction/SendCustomTx'
import { ReviewTxProp } from './screens/ReviewSendFundsTx'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'
import { SendCollectibleTxInfo } from './screens/SendCollectible'

const ChooseTxType = React.lazy(() => import('./screens/ChooseTxType'))

const SendFunds = React.lazy(() => import('./screens/SendFunds'))

const SendCollectible = React.lazy(() => import('./screens/SendCollectible'))

const ReviewCollectible = React.lazy(() => import('./screens/ReviewCollectible'))

const ReviewSendFundsTx = React.lazy(() => import('./screens/ReviewSendFundsTx'))

const ContractInteraction = React.lazy(() => import('./screens/ContractInteraction'))

const ContractInteractionReview: any = React.lazy(() => import('./screens/ContractInteraction/Review'))

const SendCustomTx = React.lazy(() => import('./screens/ContractInteraction/SendCustomTx'))

const ReviewCustomTx = React.lazy(() => import('./screens/ContractInteraction/ReviewCustomTx'))

const useStyles = makeStyles({
  loaderStyle: {
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export type TxType =
  | 'chooseTxType'
  | 'sendFunds'
  | 'sendFundsReviewTx'
  | 'contractInteraction'
  | 'contractInteractionReview'
  | 'reviewCustomTx'
  | 'sendCollectible'
  | 'reviewCollectible'
  | ''

type Props = {
  activeScreenType: TxType
  isOpen: boolean
  onClose: () => void
  recipientAddress?: string
  recipientName?: string
  selectedToken?: string | NFTToken | Erc721Transfer
  tokenAmount?: string
}

const SendModal = ({
  activeScreenType,
  isOpen,
  onClose,
  recipientAddress,
  recipientName,
  selectedToken,
  tokenAmount,
}: Props): React.ReactElement => {
  const classes = useStyles()
  const [activeScreen, setActiveScreen] = useState<TxType>(activeScreenType || 'chooseTxType')
  const [tx, setTx] = useState<unknown>({})
  const [isABI, setIsABI] = useState(true)

  const [recipient, setRecipient] = useState<string | undefined>(recipientAddress)

  useEffect(() => {
    setActiveScreen(activeScreenType || 'chooseTxType')
    setIsABI(true)
    setTx({})
    setRecipient(recipientAddress)
  }, [activeScreenType, isOpen, recipientAddress])

  const handleTxCreation = (txInfo: SendCollectibleTxInfo) => {
    setActiveScreen('sendFundsReviewTx')
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

  const handleOnPrev = (screen: TxType) => {
    setRecipient((tx as ReviewTxProp).recipientAddress)
    setActiveScreen(screen)
  }

  return (
    <Modal
      description="Send Tokens Form"
      handleClose={onClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title="Send Tokens"
    >
      <Suspense
        fallback={
          <div className={classes.loaderStyle}>
            <Loader size="md" />
          </div>
        }
      >
        {activeScreen === 'chooseTxType' && (
          <ChooseTxType
            onClose={onClose}
            recipientName={recipientName}
            recipientAddress={recipient}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'sendFunds' && (
          <SendFunds
            initialValues={tx as ReviewTxProp}
            onClose={onClose}
            onReview={handleTxCreation}
            recipientAddress={recipient}
            selectedToken={selectedToken as string}
            amount={tokenAmount}
          />
        )}

        {activeScreen === 'sendFundsReviewTx' && (
          <ReviewSendFundsTx
            onClose={onClose}
            onPrev={() => {
              handleOnPrev('sendFunds')
            }}
            tx={tx as ReviewTxProp}
          />
        )}

        {activeScreen === 'contractInteraction' && isABI && (
          <ContractInteraction
            isABI={isABI}
            switchMethod={handleSwitchMethod}
            contractAddress={recipient}
            initialValues={tx as ContractInteractionTx}
            onClose={onClose}
            onNext={handleContractInteractionCreation}
          />
        )}

        {activeScreen === 'contractInteractionReview' && isABI && tx && (
          <ContractInteractionReview onClose={onClose} onPrev={() => handleOnPrev('contractInteraction')} tx={tx} />
        )}

        {activeScreen === 'contractInteraction' && !isABI && (
          <SendCustomTx
            initialValues={tx as CustomTxProps}
            isABI={isABI}
            switchMethod={handleSwitchMethod}
            onClose={onClose}
            onNext={handleCustomTxCreation}
            contractAddress={recipient}
          />
        )}

        {activeScreen === 'reviewCustomTx' && (
          <ReviewCustomTx
            onClose={onClose}
            onPrev={() => handleOnPrev('contractInteraction')}
            tx={tx as ReviewCustomTxProps}
          />
        )}

        {activeScreen === 'sendCollectible' && (
          <SendCollectible
            initialValues={tx}
            onClose={onClose}
            onNext={handleSendCollectible}
            recipientAddress={recipient}
            selectedToken={selectedToken as NFTToken | undefined}
          />
        )}

        {activeScreen === 'reviewCollectible' && (
          <ReviewCollectible
            onClose={onClose}
            onPrev={() => handleOnPrev('sendCollectible')}
            tx={tx as CollectibleTx}
          />
        )}
      </Suspense>
    </Modal>
  )
}

export default SendModal
