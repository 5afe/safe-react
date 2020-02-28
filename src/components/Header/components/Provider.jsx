// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as React from 'react'

import { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Divider from '~/components/layout/Divider'
import { md, screenSm, sm } from '~/theme/variables'

type Props = Open & {
  classes: Object,
  popupDetails: React.Node,
  info: React.Node,
  children: Function,
}

const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '284px',
      marginRight: '20px',
    },
  },
  provider: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    padding: sm,
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: md,
      paddingRight: md,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
})

type ProviderRef = { current: null | HTMLDivElement }

class Provider extends React.Component<Props> {
  myRef: ProviderRef

  constructor(props: Props) {
    super(props)

    this.myRef = React.createRef()
  }

  render() {
    const { children, classes, info, open, toggle } = this.props

    return (
      <>
        <div className={classes.root} ref={this.myRef}>
          <Divider />
          <Col className={classes.provider} end="sm" middle="xs" onClick={toggle}>
            {info}
            <IconButton className={classes.expand} disableRipple>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
          <Divider />
        </div>
        {children(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles)(Provider)
