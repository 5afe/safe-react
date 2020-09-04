import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AddressInfo from 'src/components/AddressInfo'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gasNew'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import Header from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Header'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import {
  generateFormFieldKey,
  getValueFromTxInputs,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { TokenLogo } from 'src/components/TokenLogo'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { Token } from 'src/logic/tokens/store/model/token'

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

const ContractInteractionReview = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const token = useToken(ETH_ADDRESS) as Token | null

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async (): Promise<void> => {
      const { fromWei, toBN } = getWeb3().utils
      const txData = tx.data ? tx.data.trim() : ''

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, tx.contractAddress as string, txData)
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
  }, [safeAddress, tx.contractAddress, tx.data])

  const submitTx = async () => {
    const web3 = getWeb3()
    const txRecipient = tx.contractAddress as string
    const txData = tx.data ? tx.data.trim() : ''
    const txValue = tx.value ? web3.utils.toWei(tx.value, 'ether') : '0'

    dispatch(
      createTransaction({
        safeAddress,
        to: txRecipient,
        valueInWei: txValue,
        txData,
        notifiedTransaction: TX_NOTIFICATION_TYPES.STANDARD_TX,
      }),
    )

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
            <TokenLogo height={28} tokenName={token?.name || ''} tokenLogoUri={token?.logoUri || ''} />
          </Col>
          <Col layout="column" xs={11}>
            <Block justify="left">
              <Paragraph className={classes.value} noMargin size="md" style={{ margin: 0 }}>
                {tx.value || 0}
                {' ETH'}
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

export default ContractInteractionReview
