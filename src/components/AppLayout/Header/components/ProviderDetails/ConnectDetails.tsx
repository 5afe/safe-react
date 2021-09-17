import { withStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'

import ConnectButton from 'src/components/ConnectButton'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import { Card } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

const styles = () => ({
  logo: {
    justifyContent: 'center',
  },
  text: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  connect: {
    textAlign: 'center',
    marginTop: '60px',
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

const StyledCard = styled(Card)`
  padding: 20px;
`
const ConnectDetails = ({ classes }): ReactElement => (
  <StyledCard>
    <Row align="center" margin="lg">
      <Paragraph className={classes.text} noMargin size="xl" weight="bolder">
        Connect a Wallet
      </Paragraph>
    </Row>

    <Row className={classes.logo}>
      <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
    </Row>
    <Block className={classes.connect}>
      <ConnectButton data-testid="heading-connect-btn" />
    </Block>
  </StyledCard>
)

export default withStyles(styles as any)(ConnectDetails)
