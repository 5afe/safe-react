import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import { getNetworkInfo } from 'src/config'
import { fromTokenUnit, toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import AddressInfo from 'src/components/AddressInfo'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gas'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import Header from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Header'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { generateFormFieldKey, getValueFromTxInputs } from '../utils'

const useStyles = makeStyles(styles)

export type TransactionReviewType = {
  abi?: string
  contractAddress?: string
  data?: string
  value?: string
  selectedMethod?: AbiItemExtended
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: TransactionReviewType
}

const { nativeCoin } = getNetworkInfo()

const ContractInteractionReview = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { address: safeAddress } = useSelector(safeSelector) || {}
  const [gasCosts, setGasCosts] = useState('< 0.001')
  useEffect(() => {
    let isCurrent = true

    const estimateGas = async (): Promise<void> => {
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
  }, [safeAddress, tx.contractAddress, tx.data])

  const submitTx = async () => {
    const txRecipient = tx.contractAddress
    const txData = tx.data ? tx.data.trim() : ''
    const txValue = tx.value ? toTokenUnit(tx.value, nativeCoin.decimals) : '0'
    if (safeAddress) {
      dispatch(
        createTransaction({
          safeAddress,
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
      <Header onClose={onClose} subTitle="2 of 2" title="Contract Interaction" />
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Contract Address
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <AddressInfo safeAddress={tx.contractAddress as string} />
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Value
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Col xs={1}>
            <Img alt="Ether" height={28} onError={setImageToPlaceholder} src={getEthAsToken('0').logoUri} />
          </Col>
          <Col layout="column" xs={11}>
            <Block justify="left">
              <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                {tx.value || 0}
                {' ' + nativeCoin.name}
              </Paragraph>
            </Block>
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
            Method
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <Paragraph className={classes.value} size="md" style={{ margin: 0 }}>
            {tx.selectedMethod?.name}
          </Paragraph>
        </Row>
        {tx.selectedMethod?.inputs?.map(({ name, type }, index) => {
          const key = generateFormFieldKey(type, tx.selectedMethod?.signatureHash || '', index)
          const value: string = getValueFromTxInputs(key, type, tx)

          return (
            <React.Fragment key={key}>
              <Row margin="xs">
                <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                  {name} ({type})
                </Paragraph>
              </Row>
              <Row align="center" margin="md">
                <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                  {value}
                </Paragraph>
              </Row>
            </React.Fragment>
          )
        })}
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

export default ContractInteractionReview
