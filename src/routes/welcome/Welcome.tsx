import { ReactElement } from 'react'
import { Button, Card, Title, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/styles'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Link from 'src/components/layout/Link'
import { LOAD_ADDRESS, OPEN_ADDRESS } from 'src/routes/routes'

function Welcome(): ReactElement {
  const classes = useStyles()
  return (
    <Page align="center">
      <Block>
        <Title size="md" strong>
          Welcome to Gnosis Safe.
        </Title>
        <Title size="xs">
          Gnosis Safe is the most trusted platform to manage digital assets. <br /> Here is how to get started:
        </Title>
        <div className={classes.cardsContainer}>
          {/* Create Safe Card */}
          <Card className={classes.card}>
            <Title size="sm" strong withoutMargin>
              Create Safe
            </Title>
            <div className={classes.cardDescription}>
              <Text size="xl">Create a new Safe Multisig that is controlled by one or multiple owners.</Text>
              <Text size="xl">You will be required to pay a network fee for creating your new Safe.</Text>
            </div>
            <Button
              className={classes.cardButton}
              size="lg"
              color="primary"
              variant="contained"
              component={Link}
              to={OPEN_ADDRESS}
            >
              <Text size="xl" color="white">
                + Create new Safe
              </Text>
            </Button>
          </Card>
          <div className={classes.separator}>or</div>
          {/* Load Safe Card */}
          <Card className={classes.card}>
            <Title size="sm" strong withoutMargin>
              Load Existing Safe
            </Title>
            <div className={classes.cardDescription}>
              <Text size="xl">
                Already have a Safe or want to access it from a different device? Easily load your Safe MultiSig using
                your Safe address.
              </Text>
            </div>
            <Button
              className={classes.cardButton}
              variant="bordered"
              iconType="safe"
              iconSize="sm"
              size="lg"
              color="secondary"
              component={Link}
              to={LOAD_ADDRESS}
            >
              <Text size="xl" color="secondary">
                Add existing Safe
              </Text>
            </Button>
          </Card>
        </div>
      </Block>
    </Page>
  )
}

export default Welcome

const useStyles = makeStyles({
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '24px',
    height: '300px',
    maxWidth: '1200px',
  },
  card: {
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    alignItems: 'flex-start',
  },
  cardDescription: {
    marginTop: '16px',
  },
  cardButton: {
    marginTop: 'auto',
  },
  separator: {
    alignSelf: 'center',
    padding: '0 16px',
    fontSize: '32px',
  },
})
