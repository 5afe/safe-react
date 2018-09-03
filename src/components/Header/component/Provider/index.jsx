// @flow
import * as React from 'react'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import Connected from './Connected'
import UserDetails from './UserDetails'

type Props = Open & {
  provider: string,
  network: string,
  userAddress: string,
  connected: boolean,
}

const Provider = ({
  open, toggle, provider, network, userAddress, connected,
}: Props) => (
  <Connected
    provider={provider}
    network={network}
    userAddress={userAddress}
    connected={connected}
    open={open}
    toggle={toggle}
  >
    {providerRef => (
      <Popper open={open} anchorEl={providerRef.current} placement="bottom-end">
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
          >
            <ClickAwayListener onClickAway={toggle}>
              <UserDetails
                provider={provider}
                network={network}
                userAddress={userAddress}
                connected={connected}
              />
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    )}
  </Connected>
)

export default openHoc(Provider)
