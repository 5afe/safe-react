// @flow
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import CustomTxIcon from './assets/custom.svg'
import IncomingTxIcon from './assets/incoming.svg'
import OutgoingTxIcon from './assets/outgoing.svg'
import SettingsTxIcon from './assets/settings.svg'
import { styles } from './style'

import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph/'
import { type TransactionType } from '~/routes/safe/store/models/transaction'

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
      <Img alt={typeToLabel[txType]} className={classes.img} src={typeToIcon[txType]} />
      <Paragraph className={classes.type} noMargin>
        {typeToLabel[txType]}
      </Paragraph>
    </Block>
  )
}

export default TxType
