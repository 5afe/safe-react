// @flow
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import { safeSelector } from '~/routes/safe/store/selectors'
import { sm } from '~/theme/variables'

type Props = {
  closeSnackbar: () => void,
  enqueueSnackbar: () => void,
  onClose: () => void,
  onPrev: () => void,
  tx: Object,
}

const useStyles = makeStyles(styles)

const ContractInteractionReview = ({ closeSnackbar, enqueueSnackbar, onClose, onPrev, tx }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(safeSelector)
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      const { fromWei, toBN } = getWeb3().utils
      const txData = tx.data ? tx.data.trim() : ''

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, tx.recipientAddress, txData)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)

      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [])

  const submitTx = async () => {
    const web3 = getWeb3()
    const txRecipient = tx.recipientAddress
    const txData = tx.data ? tx.data.trim() : ''
    const txValue = tx.value ? web3.utils.toWei(tx.value, 'ether') : '0'

    dispatch(
      createTransaction({
        safeAddress,
        to: txRecipient,
        valueInWei: txValue,
        txData,
        notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        enqueueSnackbar,
        closeSnackbar,
      }),
    )

    onClose()
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Contract Interaction Review
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <SafeInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
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
            Value
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Img alt="Ether" height={28} onError={setImageToPlaceholder} src={getEthAsToken('0').logoUri} />
          <Paragraph className={classes.value} noMargin size="md">
            {tx.value || 0}
            {' ETH'}
          </Paragraph>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Data (hex encoded)
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Col className={classes.outerData}>
            <Row className={classes.data} size="md">
              {tx.data}
            </Row>
          </Col>
        </Row>
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} onClick={onPrev}>
          Back
        </Button>
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="submit-tx-btn"
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

export default withSnackbar(ContractInteractionReview)
