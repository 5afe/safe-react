import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import { screenSm, sm } from 'src/theme/variables'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '280px',
    },
  },
  provider: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    padding: sm,
    color: '#12c375',

    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: sm,
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
    color: '#12c375',
  },
})

const Container = styled.div`
  background-color: black;
  border: #12c375 3px solid;
  padding: 0rem 1rem;
  margin-top: 0.5rem;
  margin-right: 1rem;
`

class Provider extends React.Component<any> {
  myRef

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  render() {
    const { render, classes, info, open, toggle } = this.props

    console.log(info.props)
    const providerData = info.props

    const parsedPrefixAddress = parsePrefixedAddress(providerData.userAddress)

    const prefix = parsedPrefixAddress.prefix
    const address = parsedPrefixAddress.address

    const parseAddress = (address: string): string => {
      return `${address.substring(0,5)}....${address.substring(address.length-3)}`
    }


    return (
      <>
        <div className={classes.root} ref={this.myRef}>
          <Col className={classes.provider} end="sm" middle="xs" onClick={toggle}>
            <Container>
              <p>{`${prefix}: ${parseAddress(address)}`}</p>
            </Container>

            <IconButton className={classes.expand} disableRipple>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
        </div>
        {render(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles as any)(Provider)
