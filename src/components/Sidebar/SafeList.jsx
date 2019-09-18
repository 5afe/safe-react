// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Link from '~/components/layout/Link'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import {
  mediumFontSize, sm, secondary, primary,
} from '~/theme/variables'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { type Safe } from '~/routes/safe/store/models/safe'
import { SAFELIST_ADDRESS } from '~/routes/routes'

type SafeListProps = {
  safes: List<Safe>,
  onSafeClick: Function,
}

const useStyles = makeStyles({
  icon: {
    marginRight: sm,
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  safeName: {
    color: secondary,
  },
  safeAddress: {
    color: primary,
    fontSize: mediumFontSize,
  },
})

const SafeList = ({ safes, onSafeClick }: SafeListProps) => {
  const classes = useStyles()

  return (
    <MuiList>
      {safes.map((safe) => (
        <React.Fragment key={safe.address}>
          <Link to={`${SAFELIST_ADDRESS}/${safe.address}`} onClick={onSafeClick}>
            <ListItem classes={{ root: classes.listItemRoot }}>
              <ListItemIcon>
                <Identicon address={safe.address} diameter={32} className={classes.icon} />
              </ListItemIcon>
              <ListItemText
                primary={safe.name}
                secondary={shortVersionOf(safe.address, 4)}
                classes={{ primary: classes.safeName, secondary: classes.safeAddress }}
              />
              <Paragraph size="lg" color="primary">
                {safe.ethBalance}
                {' '}
                ETH
              </Paragraph>
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}
    </MuiList>
  )
}

export default SafeList
