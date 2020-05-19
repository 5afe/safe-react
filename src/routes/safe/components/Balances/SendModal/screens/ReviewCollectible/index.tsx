import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

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
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gasNew'
import {
  containsMethodByHash,
  getERC721TokenContract,
  getHumanFriendlyToken,
} from 'src/logic/tokens/store/actions/fetchTokens'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH } from 'src/logic/tokens/utils/tokenHelpers'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import createTransaction from 'src/routes/safe/store/actions/createTransaction'
import { safeSelector } from 'src/routes/safe/store/selectors'
import { sm } from 'src/theme/variables'
import { textShortener } from 'src/utils/strings'

const useStyles = makeStyles(styles as any)

const ReviewCollectible = ({ closeSnackbar, enqueueSnackbar, onClose, onPrev, tx }) => {
  const classes = useStyles()
  const shortener = textShortener()
  const dispatch = useDispatch()
  const { address: safeAddress } = useSelector(safeSelector)
  const nftTokens = useSelector(nftTokensSelector)
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const txToken = nftTokens.find(
    ({ assetAddress, tokenId }) => assetAddress === tx.assetAddress && tokenId === tx.nftTokenId,
  )
  const [data, setData] = useState('')

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      const { fromWei, toBN } = getWeb3().utils

      const supportsSafeTransfer = await containsMethodByHash(tx.assetAddress, SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH)
      const methodToCall = supportsSafeTransfer ? SAFE_TRANSFER_FROM_WITHOUT_DATA_HASH : 'transfer'
      const transferParams = [tx.recipientAddress, tx.nftTokenId]
      const params = methodToCall === 'transfer' ? transferParams : [safeAddress, ...transferParams]

      const ERC721Token = methodToCall === 'transfer' ? await getHumanFriendlyToken() : await getERC721TokenContract()
      const tokenInstance = await ERC721Token.at(tx.assetAddress)
      const txData = tokenInstance.contract.methods[methodToCall](...params).encodeABI()

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, tx.recipientAddress, txData)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)

      if (isCurrent) {
        setGasCosts(formattedGasCosts)
        setData(txData)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, tx.assetAddress, tx.nftTokenId, tx.recipientAddress])

  const submitTx = async () => {
    dispatch(
      createTransaction({
        safeAddress,
        to: tx.assetAddress,
        valueInWei: '0',
        txData: data,
        notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        enqueueSnackbar,
        closeSnackbar,
      } as any),
    )
    onClose()
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
              <EtherscanBtn type="address" value={tx.recipientAddress} />
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
              {shortener(txToken.name)} (Token ID: {shortener(txToken.tokenId)})
            </Paragraph>
          </Row>
        )}
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
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

export default withSnackbar(ReviewCollectible)
