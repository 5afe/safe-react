import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'

import { getNetworkInfo } from 'src/config'
import { fromTokenUnit, toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
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
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gas'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { sm } from 'src/theme/variables'

import ArrowDown from '../../assets/arrow-down.svg'

import { styles } from './style'

export type CustomTx = {
  contractAddress?: string
  data?: string
  value?: string
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: CustomTx
}

const useStyles = makeStyles(styles)

const { nativeCoin } = getNetworkInfo()

const ReviewCustomTx = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { address: safeAddress } = useSelector(safeSelector) || {}
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      const txData = tx.data ? tx.data.trim() : ''

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress as string, tx.contractAddress as string, txData)
      const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const formattedGasCosts = formatAmount(gasCosts)

      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [safeAddress, tx.data, tx.contractAddress])

  const submitTx = async (): Promise<void> => {
    const txRecipient = tx.contractAddress
    const txData = tx.data ? tx.data.trim() : ''
    const txValue = tx.value ? toTokenUnit(tx.value, nativeCoin.decimals) : '0'

    if (safeAddress) {
      dispatch(
        createTransaction({
          safeAddress: safeAddress,
          to: txRecipient as string,
          valueInWei: txValue,
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
        }),
      )
    } else {
      console.error('There was an error trying to submit the transaction, the safeAddress was not found')
    }

    onClose()
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Send Custom Tx
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
            <Identicon address={tx.contractAddress as string} diameter={32} />
          </Col>
          <Col layout="column" xs={11}>
            <Block justify="left">
              <Paragraph noMargin weight="bolder">
                {tx.contractAddress}
              </Paragraph>
              <CopyBtn content={tx.contractAddress as string} />
              <EtherscanBtn value={tx.contractAddress as string} />
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
            {' ' + nativeCoin.name}
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
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
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

export default ReviewCustomTx
