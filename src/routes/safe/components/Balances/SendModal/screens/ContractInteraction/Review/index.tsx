import { useEffect, useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import {
  generateFormFieldKey,
  getValueFromTxInputs,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'
import { TransferAmount } from 'src/routes/safe/components/Balances/SendModal/TransferAmount'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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
  onEditTxParameters: () => void
  tx: TransactionReviewType
  txParameters: TxParameters
}

const ContractInteractionReview = ({ onClose, onPrev, tx }: Props): React.ReactElement => {
  const explorerUrl = getExplorerInfo(tx.contractAddress as string)
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const nativeCurrency = getNativeCurrency()
  const addressName = useSelector((state) => addressBookEntryName(state, { address: tx.contractAddress as string }))

  const [txInfo, setTxInfo] = useState<{
    txRecipient: string
    txData: string
    txAmount: string
  }>({ txData: '', txAmount: '', txRecipient: '' })

  useEffect(() => {
    setTxInfo({
      txRecipient: tx.contractAddress as string,
      txAmount: tx.value ? toTokenUnit(tx.value, nativeCurrency.decimals) : '0',
      txData: tx.data ? tx.data.trim() : '',
    })
  }, [tx.contractAddress, tx.value, tx.data, safeAddress, nativeCurrency.decimals])

  const submitTx = (txParameters: TxParameters, delayExecution: boolean) => {
    if (safeAddress && txInfo) {
      dispatch(
        createTransaction({
          safeAddress,
          to: txInfo?.txRecipient,
          valueInWei: txInfo?.txAmount,
          txData: txInfo?.txData,
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
    <TxModalWrapper
      txData={txInfo?.txData}
      txValue={txInfo?.txAmount}
      txTo={txInfo?.txRecipient}
      onSubmit={submitTx}
      onBack={onPrev}
    >
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 2)} title="Contract interaction" />
      <Hairline />
      <Block className={classes.formContainer}>
        <Row align="center" margin="md">
          <TransferAmount token={getEthAsToken('0')} text={`${tx.value || 0} ${nativeCurrency.symbol}`} />
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Contract Address
          </Paragraph>
        </Row>
        <Row align="center" margin="md">
          <PrefixedEthHashInfo
            hash={tx.contractAddress as string}
            name={addressName}
            strongName
            showAvatar
            showCopyBtn
            explorerUrl={explorerUrl}
          />
        </Row>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Method
          </Paragraph>
        </Row>
        <Row align="center" margin="lg">
          <Paragraph className={classes.value} size="lg" style={{ margin: 0 }}>
            {tx.selectedMethod?.name}
          </Paragraph>
        </Row>
        {tx.selectedMethod?.inputs?.map(({ name, type }, index) => {
          const key = generateFormFieldKey(type, tx.selectedMethod?.signatureHash || '', index)
          const value: string = getValueFromTxInputs(key, type, tx)

          return (
            <Fragment key={key}>
              <Row margin="xs">
                <Paragraph color="disabled" noMargin size="lg">
                  {name} ({type})
                </Paragraph>
              </Row>
              <Row align="center" margin="md">
                <Paragraph className={classes.value} noMargin size="lg" style={{ margin: 0 }}>
                  {value}
                </Paragraph>
              </Row>
            </Fragment>
          )
        })}
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Data (hex encoded)
          </Paragraph>
        </Row>
        <Row align="center">
          <Col className={classes.outerData}>
            <Row className={classes.data} size="lg">
              {tx.data}
            </Row>
          </Col>
        </Row>
      </Block>
    </TxModalWrapper>
  )
}

export default ContractInteractionReview
