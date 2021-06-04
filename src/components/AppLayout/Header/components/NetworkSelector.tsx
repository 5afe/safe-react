import * as React from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Divider, Icon } from '@gnosis.pm/safe-react-components'

import NetworkLabel from './NetworkLabel'
import Col from 'src/components/layout/Col'
import { screenSm, sm } from 'src/theme/variables'

import { sameString } from 'src/utils/strings'
import { ReturnValue } from 'src/logic/hooks/useStateHandler'
import { NetworkSettings } from 'src/config/networks/network'

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '180px',
      marginRight: '20px',
    },
  },
  networkList: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'space-between',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
  popper: {
    zIndex: 2000,
  },
  network: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '180px',
    padding: '0',
  },
}

const useStyles = makeStyles(styles)

const StyledLink = styled.a`
  margin: 0;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  padding: 14px 16px 14px 0;

  :hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`
const StyledDivider = styled(Divider)`
  margin: 0;
`

type NetworkSelectorProps = ReturnValue & {
  selected: string
  networks: (Partial<NetworkSettings> & { safeUrl: string })[]
}

const NetworkSelector = ({ open, toggle, selected, networks, clickAway }: NetworkSelectorProps): React.ReactElement => {
  const networkRef = React.useRef(null)
  const classes = useStyles()
  return (
    <>
      <div className={classes.root} ref={networkRef}>
        <Col className={classes.networkList} end="sm" middle="xs" onClick={toggle}>
          <NetworkLabel networkName={selected} />
          <IconButton className={classes.expand} disableRipple>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Col>
        <Divider />
      </div>
      <Popper
        anchorEl={networkRef.current}
        className={classes.popper}
        open={open}
        placement="bottom"
        popperOptions={{ positionFixed: true }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <>
              <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                <List className={classes.network} component="div">
                  {networks.map((network) => (
                    <React.Fragment key={network.id}>
                      <StyledLink href={network.safeUrl}>
                        <NetworkLabel networkInfo={network} networkName={network.label} />
                        {sameString(selected, network.label?.toLowerCase()) && (
                          <Icon type="check" size="md" color="primary" />
                        )}
                      </StyledLink>
                      <StyledDivider />
                    </React.Fragment>
                  ))}
                </List>
              </ClickAwayListener>
            </>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default withStyles(styles as any)(NetworkSelector)
