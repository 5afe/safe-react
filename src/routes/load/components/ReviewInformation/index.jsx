// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import { xs, sm, lg, border, secondary } from '~/theme/variables'
import { openAddressInEtherScan } from '~/logic/wallets/getWeb3'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '~/routes/load/components/fields'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  name: {
    letterSpacing: '-0.6px',
  },
  container: {
    marginTop: xs,
    alignItems: 'center',
  },
  address: {
    paddingLeft: '6px',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

type LayoutProps = {
  network: string,
}

type Props = LayoutProps & {
  values: Object,
  classes: Object,
}

const ReviewComponent = ({ values, classes, network }: Props) => {
  const safeAddress = values[FIELD_LOAD_ADDRESS]

  return (
    <React.Fragment>
      <Block className={classes.details}>
        <Block margin="lg">
          <Paragraph size="sm" color="disabled" noMargin>
            Name of the Safe
          </Paragraph>
          <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
            {values[FIELD_LOAD_NAME]}
          </Paragraph>
        </Block>
        <Block margin="lg">
          <Paragraph size="sm" color="disabled" noMargin>
            Safe address
          </Paragraph>
          <Row className={classes.container}>
            <Identicon address={safeAddress} diameter={32} />
            <Paragraph size="md" color="disabled" noMargin className={classes.address}>{safeAddress}</Paragraph>
            <OpenInNew
              className={classes.open}
              style={openIconStyle}
              onClick={openAddressInEtherScan(safeAddress, network)}
            />
          </Row>
        </Block>
        <Block margin="lg">
          <Paragraph size="sm" color="disabled" noMargin>
            Connected wallet client is owner?
          </Paragraph>
          <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
            No (read-only)
          </Paragraph>
        </Block>
      </Block>
    </React.Fragment>
  )
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = ({ network }: LayoutProps) => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage network={network} values={values} />
    </OpenPaper>
  </React.Fragment>
)


export default Review
