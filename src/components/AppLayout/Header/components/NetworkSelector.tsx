import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as React from 'react'

import NetworkLabel from './NetworkLabel'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'
import { screenSm, sm } from 'src/theme/variables'

const styles = () => ({
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
    /* padding: sm, */
    justifyContent: 'space-between',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
})

class NetworkSelector extends React.Component<any> {
  myRef

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  render() {
    const { render, classes, open, toggle } = this.props

    return (
      <>
        <div className={classes.root} ref={this.myRef}>
          <Col className={classes.networkList} end="sm" middle="xs" onClick={toggle}>
            {/* ToDo read the networkname from the current wallet */}
            <NetworkLabel networkName="Ethereum" />
            <IconButton className={classes.expand} disableRipple>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
          <Divider />
        </div>
        {render(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles as any)(NetworkSelector)
