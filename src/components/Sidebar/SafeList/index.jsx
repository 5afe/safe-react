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
import ButtonLink from '~/components/layout/ButtonLink'
import Identicon from '~/components/Identicon'
import {
  mediumFontSize, sm, primary, disabled, md,
} from '~/theme/variables'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { shortVersionOf, sameAddress } from '~/logic/wallets/ethAddresses'
import { type Safe } from '~/routes/safe/store/models/safe'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import DefaultBadge from './DefaultBadge'
import Img from '~/components/layout/Img'
import check from '~/assets/icons/check.svg'

export const SIDEBAR_SAFELIST_ROW_TESTID = 'SIDEBAR_SAFELIST_ROW_TESTID'

type SafeListProps = {
  safes: List<Safe>,
  currentSafe: string,
  onSafeClick: Function,
  setDefaultSafe: Function,
  defaultSafe: string,
}

const useStyles = makeStyles({
  icon: {
    marginRight: sm,
  },
  checkIcon: {
    marginRight: '10px',
  },
  list: {
    overflow: 'hidden',
    overflowY: 'hidden',
    padding: 0,
    height: '100%',
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

const SafeList = ({
  safes, onSafeClick, setDefaultSafe, defaultSafe, currentSafe,
}: SafeListProps) => {
  const classes = useStyles()

  return (
    <MuiList className={classes.list}>
      {safes.map((safe) => (
        <React.Fragment key={safe.address}>
          <Link
            to={`${SAFELIST_ADDRESS}/${safe.address}/balances`}
            onClick={onSafeClick}
            data-testid={SIDEBAR_SAFELIST_ROW_TESTID}
          >
            <ListItem classes={{ root: classes.listItemRoot }}>
              { sameAddress(currentSafe, safe.address) ? (
                <ListItemIcon>
                  <Img src={check} alt="check" className={classes.checkIcon} />
                </ListItemIcon>
              ) : <div className={classes.noIcon}>placeholder</div> }
              <ListItemIcon>
                <Identicon address={safe.address} diameter={32} className={classes.icon} />
              </ListItemIcon>
              <ListItemText
                primary={safe.name}
                secondary={shortVersionOf(safe.address, 4)}
                classes={{ primary: classes.safeName, secondary: classes.safeAddress }}
              />
              <Paragraph size="lg" color="primary">
                {`${formatAmount(safe.ethBalance)} ETH`}
              </Paragraph>
              {sameAddress(defaultSafe, safe.address) ? (
                <DefaultBadge />
              ) : (
                <ButtonLink
                  className={classes.makeDefaultBtn}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    setDefaultSafe(safe.address)
                  }}
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
