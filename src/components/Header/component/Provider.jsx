// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Col from '~/components/layout/Col'
import { type Open } from '~/components/hoc/OpenHoc'
import { sm, md } from '~/theme/variables'

type Props = Open & {
  classes: Object,
  popupDetails: React.Node,
  info: React.Node,
  children: Function,
}

const styles = () => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexBasis: '250px',
  },
  provider: {
    padding: `${sm} ${md}`,
    alignItems: 'center',
    flex: '1 1 auto',
    display: 'flex',
    cursor: 'pointer',
  },
  expand: {
    width: '30px',
    height: '30px',
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
    const {
      open, toggle, children, classes, info,
    } = this.props

    return (
      <>
        <div ref={this.myRef} className={classes.root}>
          <Col end="sm" middle="xs" className={classes.provider} onClick={toggle}>
            {info}
            <IconButton disableRipple className={classes.expand}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
        </div>
        {children(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles)(Provider)
