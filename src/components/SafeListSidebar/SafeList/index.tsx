import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { Icon } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'

import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Collapse from 'src/components/Collapse'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES } from 'src/routes/routes'
import { AddressWrapper } from 'src/components/SafeListSidebar/SafeList/AddressWrapper'
import { OwnedAddress } from 'src/components/SafeListSidebar/SafeList/OwnedAddress'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import { background } from 'src/theme/variables'

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
    '&:hover': {
      backgroundColor: background,
    },
  },
  listItemCollapse: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: '50px',
    '& > div > div:first-child': {
      paddingLeft: '44px',
    },
  },
  noIcon: {
    visibility: 'hidden',
    width: '28px',
  },
})

type Props = {
  currentSafeAddress: string | undefined
  safes: SafeRecordWithNames[]
  ownedSafes: string[]
  onSafeClick: () => void
}

const isAddressAdded = (addedSafes: SafeRecordWithNames[], address: string): boolean => {
  return addedSafes.some((safe) => sameAddress(safe.address, address))
}

export const SafeList = ({ currentSafeAddress, onSafeClick, safes, ownedSafes }: Props): React.ReactElement => {
  const classes = useStyles()
  const ownedSafesExpanded = ownedSafes.some((address) => {
    return address === currentSafeAddress && !isAddressAdded(safes, address)
  })

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
              <AddressWrapper safe={safe} />
            </ListItem>
          </Link>
          <Hairline />
        </React.Fragment>
      ))}

      {ownedSafes.length > 0 && (
        <ListItem classes={{ root: classes.listItemCollapse }}>
          <Collapse title={`All owned Safes (${ownedSafes.length})`} defaultExpanded={ownedSafesExpanded}>
            {ownedSafes.map((address: string) => (
              <React.Fragment key={address}>
                <OwnedAddress address={address} onClick={onSafeClick} isAdded={isAddressAdded(safes, address)}>
                  {getLink(address)}
                </OwnedAddress>
                <Hairline />
              </React.Fragment>
            ))}
          </Collapse>
        </ListItem>
      )}
    </MuiList>
  )
}
