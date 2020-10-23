import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getNetworkInfo } from 'src/config'

import { styles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { estimateTxGasCosts } from 'src/logic/safe/transactions/gas'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

const useStyles = makeStyles(styles)

type Props = {
  isOpen: boolean
  onClose: () => void
  tx: Transaction
}

const { nativeCoin } = getNetworkInfo()

const RejectTxModal = ({ isOpen, onClose, tx }: Props): React.ReactElement => {
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const classes = useStyles()

  useEffect(() => {
    let isCurrent = true
    const estimateGasCosts = async () => {
      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, safeAddress, EMPTY_DATA)
      const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const formattedGasCosts = formatAmount(gasCosts)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGasCosts()

    return () => {
      isCurrent = false
    }
  }, [safeAddress])

  const sendReplacementTransaction = () => {
    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        notifiedTransaction: TX_NOTIFICATION_TYPES.CANCELLATION_TX,
        txNonce: tx.nonce,
        origin: tx.origin,
      }),
    )
    onClose()
  }

  return (
    <Modal description="Reject Transaction" handleClose={onClose} open={isOpen} title="Reject Transaction">
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Reject transaction
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row>
          <Paragraph>
            This action will cancel this transaction. A separate transaction will be performed to submit the rejection.
          </Paragraph>
          <Paragraph color="medium" size="sm">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
          </Paragraph>
        </Row>
        <Row>
          <Paragraph>
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Exit
        </Button>
        <Button
          color="secondary"
          minHeight={42}
          minWidth={214}
          onClick={sendReplacementTransaction}
          type="submit"
          variant="contained"
        >
          Reject Transaction
        </Button>
      </Row>
    </Modal>
  )
}

export default RejectTxModal
