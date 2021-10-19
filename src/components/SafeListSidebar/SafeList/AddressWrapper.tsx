import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'

import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getNetworkInfo } from 'src/config'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    padding: '5px 0',
    width: '100%',
    justifyContent: 'space-between',
    '& > nth-child(2)': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  addressDetails: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '175px',
    '& div': {
      marginLeft: '0px',
      padding: '5px 20px',
      '& img': {
        marginRight: '5px',
      },
      '& p': {
        marginTop: '3px',
      },
    },
  },
})

type Props = {
  safe: SafeRecordWithNames
}

const { nativeCoin } = getNetworkInfo()

export const AddressWrapper = ({ safe }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <EthHashInfo hash={safe.address} name={safe.name} showAvatar shortenHash={4} />

      <div className={classes.addressDetails}>
        <Text size="xl">{`${formatAmount(safe.ethBalance)} ${nativeCoin.name}`}</Text>
      </div>
    </div>
  )
}
