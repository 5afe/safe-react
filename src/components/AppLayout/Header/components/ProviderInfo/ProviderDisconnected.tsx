import { withStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'

import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import styled from 'styled-components'
import { sm } from 'src/theme/variables'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'

const styles = () => ({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    paddingRight: sm,

    marginLeft: "6rem",
  },
  connect: {
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
  },
})

const NotConnectedText = styled.h2`
  color: #06fc99;
  font-size: 1rem;
`

const ConnectWalletText = styled.h2`
  color: #000;
  font-size: 0.7rem;
  `
const ConnectWalletButton = styled.div`
  margin-top: -0.5rem;
  background-color: #06fc99;
  padding: 0rem 1rem;
  border-radius: 0.3rem;
`

const ProviderDisconnected = ({ classes }): ReactElement => (
  <>
    {/* <KeyRing circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={17} mode="error" /> */}
    <Col className={classes.account} end="sm" layout="column" middle="xs">
      
      <ConnectWalletButton>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
      </ConnectWalletButton>
    </Col>
  </>
)

export default withStyles(styles as any)(ProviderDisconnected)
