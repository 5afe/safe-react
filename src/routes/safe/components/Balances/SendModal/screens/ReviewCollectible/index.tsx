import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'

import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getNetworkInfo } from 'src/config'
import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gas'
import { getERC721TokenContract } from 'src/logic/tokens/store/actions/fetchTokens'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH } from 'src/logic/tokens/utils/tokenHelpers'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { sm } from 'src/theme/variables'
import { textShortener } from 'src/utils/strings'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

const { nativeCoin } = getNetworkInfo()

const useStyles = makeStyles(styles)

export type CollectibleTx = {
  recipientAddress: string
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
  const { address: safeAddress } = useSelector(safeSelector) || {}
  const nftTokens = useSelector(nftTokensSelector)
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const txToken = nftTokens.find(
    ({ assetAddress, tokenId }) => assetAddress === tx.assetAddress && tokenId === tx.nftTokenId,
  )
  const [data, setData] = useState('')

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      try {
        const methodToCall = `0x${SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH}`
        const transferParams = [tx.recipientAddress, tx.nftTokenId]
        const params = [safeAddress, ...transferParams]
        const ERC721Token = await getERC721TokenContract()
        const tokenInstance = await ERC721Token.at(tx.assetAddress)
        const txData = tokenInstance.contract.methods[methodToCall](...params).encodeABI()

        const estimatedGasCosts = await estimateTxGasCosts(safeAddress as string, tx.recipientAddress, txData)
        const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
        const formattedGasCosts = formatAmount(gasCosts)

        if (isCurrent) {
          setGasCosts(formattedGasCosts)
          setData(txData)
        }
      } catch (error) {
        console.error('Error while calculating estimated gas:', error)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, tx.assetAddress, tx.nftTokenId, tx.recipientAddress])

  const submitTx = async () => {
    try {
      if (safeAddress) {
        dispatch(
          createTransaction({
            safeAddress,
            to: tx.assetAddress,
            valueInWei: '0',
            txData: data,
            notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
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
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <SafeInfo />
        <Row margin="md">
          <Col xs={1}>
            <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
          </Col>
          <Col center="xs" layout="column" xs={11}>
            <Hairline />
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Recipient
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Col xs={1}>
            <Identicon address={tx.recipientAddress} diameter={32} />
          </Col>
          <Col layout="column" xs={11}>
            <Block justify="left">
              <Paragraph className={classes.address} noMargin weight="bolder">
                {tx.recipientAddress}
              </Paragraph>
              <CopyBtn content={tx.recipientAddress} />
              <EtherscanBtn value={tx.recipientAddress} />
            </Block>
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            {textShortener({ charsStart: 40, charsEnd: 0 })(tx.assetName)}
          </Paragraph>
        </Row>
        {txToken && (
          <Row align="center" margin="md">
            <Img alt={txToken.name} height={28} onError={setImageToPlaceholder} src={txToken.image} />
            <Paragraph className={classes.amount} noMargin size="md">
              {shortener(txToken.name)} (Token ID: {shortener(txToken.tokenId as string)})
            </Paragraph>
          </Row>
        )}
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={onPrev}>
          Back
        </Button>
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
          disabled={!data}
          minWidth={140}
          onClick={submitTx}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default ReviewCollectible
