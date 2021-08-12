import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { Icon } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'

import { DefaultSafe } from 'src/logic/safe/store/reducer/types/safe'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Collapse from 'src/components/Collapse'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES } from 'src/routes/routes'
import { AddressWrapper } from 'src/components/SafeListSidebar/SafeList/AddressWrapper'
import { UnsavedAddress } from 'src/components/SafeListSidebar/SafeList/UnsavedAddress'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'

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
  currentSafeAddress: string | undefined
  defaultSafeAddress: DefaultSafe
  safes: SafeRecordWithNames[]
  otherSafes: string[]
  onSafeClick: () => void
}

export const SafeList = ({
  currentSafeAddress,
  defaultSafeAddress,
  onSafeClick,
  safes,
  otherSafes,
}: Props): React.ReactElement => {
  const classes = useStyles()
  const ownedSafesExpanded = otherSafes.some((address) => address === currentSafeAddress)

  const getLink = (address: string): React.ReactElement =>
    sameAddress(currentSafeAddress, address) ? (
      <StyledIcon type="check" size="md" color="primary" />
    ) : (
      <div className={classes.noIcon}>placeholder</div>
    )

  return (
    <MuiList className={classes.list}>
      {safes.map((safe) => (
        <React.Fragment key={safe.address}>
          <Link
            data-testid={SIDEBAR_SAFELIST_ROW_TESTID}
            onClick={onSafeClick}
            to={generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
              safeAddress: safe.address,
            })}
          >
            <ListItem classes={{ root: classes.listItemRoot }}>
              {getLink(safe.address)}
              <AddressWrapper safe={safe} defaultSafeAddress={defaultSafeAddress} />
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}

      {otherSafes.length > 0 && (
        <ListItem classes={{ root: classes.listItemRoot }}>
          <div className={classes.noIcon}>placeholder</div>

          <Collapse title={`Owned Safes (${otherSafes.length})`} defaultExpanded={ownedSafesExpanded}>
            {otherSafes.map((address) => (
              <UnsavedAddress address={address} key={address} onClick={onSafeClick}>
                {getLink(address)}
              </UnsavedAddress>
            ))}
          </Collapse>
        </ListItem>
      )}
    </MuiList>
  )
}
