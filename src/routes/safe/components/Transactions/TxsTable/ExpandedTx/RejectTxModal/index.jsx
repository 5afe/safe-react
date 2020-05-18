// 
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Modal from 'components/Modal'
import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import Button from 'components/layout/Button'
import Hairline from 'components/layout/Hairline'
import Paragraph from 'components/layout/Paragraph'
import Row from 'components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'logic/safe/transactions'
import { estimateTxGasCosts } from 'logic/safe/transactions/gasNew'
import { formatAmount } from 'logic/tokens/utils/formatAmount'
import { EMPTY_DATA } from 'logic/wallets/ethTransactions'
import { getWeb3 } from 'logic/wallets/getWeb3'
import createTransaction from 'routes/safe/store/actions/createTransaction'
import { } from 'routes/safe/store/models/transaction'
import { safeParamAddressFromStateSelector } from 'routes/safe/store/selectors'


const RejectTxModal = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose, tx }) => {
  const [gasCosts, setGasCosts] = useState('< 0.001')
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  useEffect(() => {
    let isCurrent = true
    const estimateGasCosts = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils

      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, safeAddress, EMPTY_DATA)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGasCosts()

    return () => {
      isCurrent = false
    }
  }, [])

  const sendReplacementTransaction = () => {
    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: 0,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CANCELLATION_TX,
        enqueueSnackbar,
        closeSnackbar,
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
            {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
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

export default withStyles(styles)(withSnackbar(RejectTxModal))
