import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { getExplorerInfo } from 'src/config'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { textShortener } from 'src/utils/strings'
import { generateERC721TransferTxData } from 'src/logic/collectibles/utils'

import { styles } from './style'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { extractSafeAddress } from 'src/routes/routes'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

const useStyles = makeStyles(styles)

export type CollectibleTx = {
  recipientAddress: string
  recipientName?: string
  assetAddress: string
  assetName: string
  nftTokenId: string
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: CollectibleTx
}

const ReviewCollectible = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const shortener = textShortener()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const nftTokens = useSelector(nftTokensSelector)

  const txToken = nftTokens.find(
    ({ assetAddress, tokenId }) => assetAddress === tx.assetAddress && tokenId === tx.nftTokenId,
  )
  const [txData, setTxData] = useState('')

  useEffect(() => {
    let isCurrent = true

    const calculateERC721TransferData = async () => {
      try {
        const encodedAbiTxData = await generateERC721TransferTxData(tx, safeAddress)
        if (isCurrent) {
          setTxData(encodedAbiTxData)
        }
      } catch (error) {
        console.error('Error calculating ERC721 transfer data:', error.message)
      }
    }
    calculateERC721TransferData()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, tx])

  const submitTx = (txParameters: TxParameters, delayExecution: boolean) => {
    try {
      if (safeAddress) {
        dispatch(
          createTransaction({
            safeAddress,
            to: tx.assetAddress,
            valueInWei: '0',
            txData,
            txNonce: txParameters.safeNonce,
            safeTxGas: txParameters.safeTxGas,
            ethParameters: txParameters,
            notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
            delayExecution,
          }),
        )
      } else {
        console.error('There was an error trying to submit the transaction, the safeAddress was not found')
      }
    } catch (error) {
      console.error('Error creating sendCollectible Tx:', error)
    } finally {
      onClose()
    }
  }

  return (
    <TxModalWrapper txData={txData} txTo={tx.assetAddress} onSubmit={submitTx} onBack={onPrev}>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 2)} title="Send collectible" />
      <Hairline />
      <Block className={classes.container}>
        <SafeInfo text="Sending from" />
        <Divider withArrow />
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Recipient
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Col xs={12}>
            <PrefixedEthHashInfo
              hash={tx.recipientAddress}
              name={tx.recipientName}
              strongName
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(tx.recipientAddress)}
            />
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            {textShortener({ charsStart: 40, charsEnd: 0 })(tx.assetName)}
          </Paragraph>
        </Row>
        {txToken && (
          <Row align="center" margin="md">
            <Img alt={txToken.name} height={28} onError={setImageToPlaceholder} src={txToken.image} />
            <Paragraph className={classes.amount} noMargin size="md">
              {shortener(txToken.name)} (Token ID: {shortener(txToken.tokenId.toString())})
            </Paragraph>
          </Row>
        )}
      </Block>
    </TxModalWrapper>
  )
}

export default ReviewCollectible
