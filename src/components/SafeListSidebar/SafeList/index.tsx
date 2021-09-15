import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'
import { getNetworks } from 'src/config'
import { NetworkSettings } from 'src/config/networks/network'
import ListItemText from 'src/components/List/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import SafeListItem from './SafeListItem'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'

export const SIDEBAR_SAFELIST_ROW_TESTID = 'SIDEBAR_SAFELIST_ROW_TESTID'

type StyledAvatarProps = Pick<NetworkSettings, 'backgroundColor' | 'textColor' | 'label'> & AvatarProps
const StyledAvatar = styled(({ textColor, label, backgroundColor, ...props }) => (
  <Avatar alt={label} {...props} />
))<StyledAvatarProps>`
  && {
    width: 15px;
    height: 15px;
    color: ${({ textColor }) => textColor};
    background-color: ${({ backgroundColor }) => backgroundColor};
    margin-right: 10px;
  }
`

const useStyles = makeStyles({
  list: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: 0,
  },
})

type Props = {
  currentSafeAddress: string | undefined
  safes: SafeRecordWithNames[]
  ownedSafes: string[]
  onSafeClick: () => void
}

export const SafeList = ({ currentSafeAddress, onSafeClick, safes, ownedSafes }: Props): React.ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()

  console.log('TODO:', safes)

  return (
    <MuiList className={classes.list}>
      {/* {safes.map((safe) => (
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
      ))} */}
      {networks.map(({ label, backgroundColor, textColor, id }) => (
        <React.Fragment key={id}>
          <ListItem selected>
            <ListItemAvatar key={id}>
              <StyledAvatar alt={label} backgroundColor={backgroundColor} textColor={textColor} />
            </ListItemAvatar>
            <ListItemText primary={label} />
          </ListItem>
          <MuiList>
            {/* TODO: Match owned safes with network */}
            {ownedSafes.map((address: string) => (
              <SafeListItem
                key={address}
                address={address}
                onSafeClick={onSafeClick}
                currentSafeAddress={currentSafeAddress}
              />
            ))}
          </MuiList>
        </React.Fragment>
      ))}
    </MuiList>
  )
}
