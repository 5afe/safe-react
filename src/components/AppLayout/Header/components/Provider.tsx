import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
// import ExpandLess from '@material-ui/icons/ExpandLess'
// import ExpandMore from '@material-ui/icons/ExpandMore'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import { screenSm, sm } from 'src/theme/variables'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import ProviderDisconnected from './ProviderInfo/ProviderDisconnected'

const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
  },
  provider: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    padding: sm,
    color: '#06fc99',

    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: sm,
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
    color: '#06fc99',
  },
})

const Container = styled.div`
cursor: pointer;
  padding: 0rem 1rem;

`

class Provider extends React.Component<any> {
  myRef

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
  }

  render() {
    const { render, classes, info, toggle } = this.props

    const providerData = info.props

    const parsedPrefixAddress = parsePrefixedAddress(providerData.userAddress)

    const address = parsedPrefixAddress.address

    const parseAddress = (address: string): string => {
      return `${address.substring(0, 5)}....${address.substring(address.length - 3)}`
    }

    return (
      <>
        <div className={classes.root} ref={this.myRef}>
          <div onClick={toggle}>

            {address ? (
              <Container>
                <p>{`${parseAddress(address)}`}</p>
              </Container>
            ) : (
              <ProviderDisconnected />
              )}
        </div>
            </div>
        {render(this.myRef)}
      </>
    )
  }
}

export default withStyles(styles as any)(Provider)
