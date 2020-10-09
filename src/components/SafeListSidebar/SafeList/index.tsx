import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { Icon } from '@gnosis.pm/safe-react-components'
import * as React from 'react'
import styled from 'styled-components'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { DefaultSafe } from 'src/routes/safe/store/reducer/types/safe'
import { SetDefaultSafe } from 'src/logic/safe/store/actions/setDefaultSafe'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { AddressWrapper } from './AddresWrapper'
export const SIDEBAR_SAFELIST_ROW_TESTID = 'SIDEBAR_SAFELIST_ROW_TESTID'

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`

const useStyles = makeStyles({
  list: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: 0,
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover .safeListMakeDefaultButton': {
      visibility: 'initial',
    },
    '&:focus .safeListMakeDefaultButton': {
      visibility: 'initial',
    },
  },
  noIcon: {
    visibility: 'hidden',
    width: '28px',
  },
})

type Props = {
  currentSafe: string | undefined
  defaultSafe: DefaultSafe
  safes: SafeRecord[]
  onSafeClick: () => void
  setDefaultSafe: SetDefaultSafe
}

const SafeList = ({ currentSafe, defaultSafe, onSafeClick, safes, setDefaultSafe }: Props): React.ReactElement => {
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
                <StyledIcon type="check" size="md" color="primary" />
              ) : (
                <div className={classes.noIcon}>placeholder</div>
              )}
              <AddressWrapper safe={safe} defaultSafe={defaultSafe} setDefaultSafe={setDefaultSafe} />
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}
    </MuiList>
  )
}

export default SafeList
