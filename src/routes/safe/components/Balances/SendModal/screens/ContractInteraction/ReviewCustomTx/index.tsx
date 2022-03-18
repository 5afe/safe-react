import { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Divider from 'src/components/Divider'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { styles } from './style'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

export type ReviewCustomTxProps = {
  contractAddress: string
  contractName?: string
  data: string
  value: string
}

type Props = {
  onClose: () => void
  onPrev: () => void
  tx: ReviewCustomTxProps
}

const useStyles = makeStyles(styles)

const ReviewCustomTx = ({ onClose, onPrev, tx }: Props): ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const nativeCurrency = getNativeCurrency()

  const txRecipient = tx.contractAddress
  const txData = tx.data ? tx.data.trim() : ''
  const txValue = tx.value ? toTokenUnit(tx.value, nativeCurrency.decimals) : '0'

  const submitTx = (txParameters: TxParameters, delayExecution: boolean) => {
    if (safeAddress) {
      dispatch(
        createTransaction({
          safeAddress: safeAddress,
          to: txRecipient as string,
          valueInWei: txValue,
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
    onClose()
  }

  return (
    <TxModalWrapper txData={txData} txValue={txValue} txTo={txRecipient} onSubmit={submitTx} onBack={onPrev}>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 2)} title="Contract interaction" />
      <Hairline />
      <Block className={classes.container}>
        <Row align="center" margin="md">
          <TransferAmount token={getEthAsToken('0')} text={`${tx.value || 0} ${nativeCurrency.symbol}`} />
        </Row>
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
              hash={tx.contractAddress as string}
              name={tx.contractName ?? ''}
              strongName
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(tx.contractAddress as string)}
            />
          </Col>
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Data (hex encoded)
          </Paragraph>
        </Row>
        <Row align="center">
          <Col className={classes.outerData}>
            <Row className={classes.data} size="md">
              {tx.data}
            </Row>
          </Col>
        </Row>
      </Block>
    </TxModalWrapper>
  )
}

export default ReviewCustomTx
