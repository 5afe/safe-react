import { ReactElement } from 'react'
import styled from 'styled-components'
import { makeStyles, createStyles } from '@material-ui/styles'

import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import { Card } from '@gnosis.pm/safe-react-components'

const useStyles = makeStyles(
  createStyles({
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
  }),
)

const StyledCard = styled(Card)`
  padding: 20px;
`
const ConnectDetails = (): ReactElement => {
  const classes = useStyles()
  return (
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
}

export default ConnectDetails
