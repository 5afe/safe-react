// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Col from '~/components/layout/Col'
import Divider from '~/components/layout/Divider'
import { type Open } from '~/components/hoc/OpenHoc'
import { sm, md, screenSm } from '~/theme/variables'

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
    const {
      open, toggle, children, classes, info,
    } = this.props

    return (
      <>
        <div ref={this.myRef} className={classes.root}>
          <Divider />
          <Col end="sm" middle="xs" className={classes.provider} onClick={toggle}>
            {info}
            <IconButton disableRipple className={classes.expand}>
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
