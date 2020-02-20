// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph/'
import Img from '~/components/layout/Img'
import { type TransactionType } from '~/routes/safe/store/models/transaction'
import OutgoingTxIcon from './assets/outgoing.svg'
import IncomingTxIcon from './assets/incoming.svg'
import CustomTxIcon from './assets/custom.svg'
import SettingsTxIcon from './assets/settings.svg'
import { styles } from './style'

type Props = {
  txType: TransactionType,
}

const typeToIcon = {
  outgoing: OutgoingTxIcon,
  incoming: IncomingTxIcon,
  custom: CustomTxIcon,
  settings: SettingsTxIcon,
  creation: SettingsTxIcon,
  cancellation: SettingsTxIcon,
  upgrade: SettingsTxIcon,
}

const typeToLabel = {
  outgoing: 'Outgoing transfer',
  incoming: 'Incoming transfer',
  custom: 'Custom transaction',
  settings: 'Modify settings',
  creation: 'Safe created',
  cancellation: 'Cancellation transaction',
  upgrade: 'Contract Upgrade',
}

const useStyles = makeStyles(styles)

const TxType = ({ txType }: Props) => {
  const classes = useStyles()

  return (
    <Block className={classes.container}>
      <Img src={typeToIcon[txType]} alt={typeToLabel[txType]} className={classes.img} />
      <Paragraph className={classes.type} noMargin>
        {typeToLabel[txType]}
      </Paragraph>
    </Block>
  )
}

export default TxType
