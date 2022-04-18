import { ReactElement } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import styled from 'styled-components'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'

import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import { grey400 } from 'src/theme/variables'
import ProviderDisconnected from 'src/components/AppLayout/Header/components/ProviderInfo/ProviderDisconnected'
import Provider from 'src/components/AppLayout/Header/components/Provider'
import ConnectDetails from 'src/components/AppLayout/Header/components/ProviderDetails/ConnectDetails'

const ConnectWallet = (): ReactElement => {
  const { clickAway, open, toggle } = useStateHandler()

  return (
    <StyledProvider>
      <Provider
        info={<ProviderDisconnected />}
        open={open}
        toggle={toggle}
        render={(providerRef) => (
          <StyledPopper
            anchorEl={providerRef.current}
            open={open}
            placement="bottom"
            popperOptions={{ positionFixed: true }}
          >
            <ClickAwayListener onClickAway={clickAway} touchEvent={false}>
              <List component="div">
                <ConnectDetails />
              </List>
            </ClickAwayListener>
          </StyledPopper>
        )}
      />
    </StyledProvider>
  )
}

export default ConnectWallet

const StyledProvider = styled.div`
  width: 300px;
  height: 56px;
  margin: 0 auto;
  border-radius: 8px;
  border: 2px solid ${grey400};
`
const StyledPopper = styled(Popper)`
  z-index: 1301;
`
