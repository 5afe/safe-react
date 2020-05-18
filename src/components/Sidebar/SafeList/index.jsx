// 
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import * as React from 'react'

import DefaultBadge from './DefaultBadge'

import check from '~/assets/icons/check.svg'
import Identicon from '~/components/Identicon'
import ButtonLink from '~/components/layout/ButtonLink'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { sameAddress, shortVersionOf } from '~/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { } from '~/routes/safe/store/models/safe'
import { disabled, md, mediumFontSize, primary, sm } from '~/theme/variables'

export const SIDEBAR_SAFELIST_ROW_TESTID = 'SIDEBAR_SAFELIST_ROW_TESTID'


const useStyles = makeStyles({
  icon: {
    marginRight: sm,
  },
  checkIcon: {
    marginRight: '10px',
  },
  list: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: 0,
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover $makeDefaultBtn': {
      visibility: 'initial',
    },
    '&:focus $makeDefaultBtn': {
      visibility: 'initial',
    },
  },
  safeName: {
    color: primary,
    overflowWrap: 'break-word',
  },
  safeAddress: {
    color: disabled,
    fontSize: mediumFontSize,
  },
  makeDefaultBtn: {
    padding: 0,
    marginLeft: md,
    visibility: 'hidden',
  },
  noIcon: {
    visibility: 'hidden',
    width: '28px',
  },
})

const SafeList = ({ currentSafe, defaultSafe, onSafeClick, safes, setDefaultSafe }) => {
  const classes = useStyles()

  return (
    <MuiList className={classes.list}>
      {safes.map((safe) => (
        <React.Fragment key={safe.address}>
          <Link
            data-testid={SIDEBAR_SAFELIST_ROW_TESTID}
            onClick={onSafeClick}
            to={`${SAFELIST_ADDRESS}/${safe.address}/balances`}
          >
            <ListItem classes={{ root: classes.listItemRoot }}>
              {sameAddress(currentSafe, safe.address) ? (
                <ListItemIcon>
                  <Img alt="check" className={classes.checkIcon} src={check} />
                </ListItemIcon>
              ) : (
                <div className={classes.noIcon}>placeholder</div>
              )}
              <ListItemIcon>
                <Identicon address={safe.address} className={classes.icon} diameter={32} />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.safeName,
                  secondary: classes.safeAddress,
                }}
                primary={safe.name}
                secondary={shortVersionOf(safe.address, 4)}
              />
              <Paragraph color="primary" size="lg">
                {`${formatAmount(safe.ethBalance)} ETH`}
              </Paragraph>
              {sameAddress(defaultSafe, safe.address) ? (
                <DefaultBadge />
              ) : (
                <ButtonLink
                  className={classes.makeDefaultBtn}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    setDefaultSafe(safe.address)
                  }}
                  size="sm"
                >
                  Make default
                </ButtonLink>
              )}
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}
    </MuiList>
  )
}

export default SafeList
