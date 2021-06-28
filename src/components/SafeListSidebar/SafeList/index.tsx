import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { Icon } from '@gnosis.pm/safe-react-components'
import * as React from 'react'
import styled from 'styled-components'

import { DefaultSafe } from 'src/logic/safe/store/reducer/types/safe'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
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

type WrapperProps = {
  address: string
  onSafeClick: Props['onSafeClick']
  currentAddress: Props['currentSafeAddress']
  children: React.ReactNode
}

const ListItemWrapper = ({ address, currentAddress, onSafeClick, children }: WrapperProps) => {
  const classes = useStyles()

  return (
    <>
      <Link
        data-testid={SIDEBAR_SAFELIST_ROW_TESTID}
        onClick={onSafeClick}
        to={`${SAFELIST_ADDRESS}/${address}/balances`}
      >
        <ListItem classes={{ root: classes.listItemRoot }}>
          {sameAddress(currentAddress, address) ? (
            <StyledIcon type="check" size="md" color="primary" />
          ) : (
            <div className={classes.noIcon}>placeholder</div>
          )}

          {children}
        </ListItem>
      </Link>
      <Hairline />
    </>
  )
}

export const SafeList = ({
  currentSafeAddress,
  defaultSafeAddress,
  onSafeClick,
  safes,
  otherSafes,
}: Props): React.ReactElement => {
  const classes = useStyles()

  return (
    <MuiList className={classes.list}>
      {safes.map((safe) => (
        <ListItemWrapper
          address={safe.address}
          currentAddress={currentSafeAddress}
          onSafeClick={onSafeClick}
          key={safe.address}
        >
          <AddressWrapper safe={safe} defaultSafeAddress={defaultSafeAddress} />
        </ListItemWrapper>
      ))}

      {otherSafes.map((address) => (
        <ListItemWrapper address={address} currentAddress={currentSafeAddress} onSafeClick={onSafeClick} key={address}>
          <UnsavedAddress address={address} />
        </ListItemWrapper>
      ))}
    </MuiList>
  )
}
