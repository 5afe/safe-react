// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import { required } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import {
  sm, md, lg, border, secondary,
} from '~/theme/variables'
import { getOwnerNameBy, getOwnerAddressBy } from '~/routes/open/components/fields'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { FIELD_LOAD_ADDRESS, THRESHOLD } from '~/routes/load/components/fields'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'

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
  owners: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  ownerNames: {
    maxWidth: '400px',
  },
  ownerAddresses: {
    alignItems: 'center',
    marginLeft: `${sm}`,
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
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `0 ${lg}`,
    marginBottom: '12px',
  },
  header: {
    padding: `${sm} ${lg}`,
  },
  name: {
    marginRight: `${sm}`,
  },
})

type LayoutProps = {
  network: string,
}

type Props = LayoutProps & {
  values: Object,
  classes: Object,
  updateInitialProps: (initialValues: Object) => void,
}

type State = {
  owners: Array<string>,
}

const calculateSafeValues = (owners: Array<string>, threshold: Number, values: Object) => {
  const initialValues = { ...values }
  for (let i = 0; i < owners.length; i += 1) {
    initialValues[getOwnerAddressBy(i)] = owners[i]
  }
  initialValues[THRESHOLD] = threshold
  return initialValues
}

class OwnerListComponent extends React.PureComponent<Props, State> {
  state = {
    owners: [],
  }

  mounted = false

  componentDidMount = async () => {
    this.mounted = true
    const { values, updateInitialProps } = this.props
    const safeAddress = values[FIELD_LOAD_ADDRESS]

    const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
    const owners = await gnosisSafe.getOwners()
    const threshold = await gnosisSafe.getThreshold()

    const initialValues = calculateSafeValues(owners.sort(), threshold, values)
    updateInitialProps(initialValues)

    if (!owners) {
      return
    }

    if (this.mounted) {
      this.setState(() => ({ owners: owners.sort() }))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { network, classes } = this.props
    const { owners } = this.state

    return (
      <React.Fragment>
        <Block className={classes.title}>
          <Paragraph noMargin size="md" color="primary">
            {`This Safe has ${owners.length} owners. Optional: Provide a name for each owner.`}
          </Paragraph>
        </Block>
        <Hairline />
        <Row className={classes.header}>
          <Col xs={4}>NAME</Col>
          <Col xs={8}>ADDRESS</Col>
        </Row>
        <Hairline />
        <Block margin="md" padding="md">
          {owners.map((x, index) => (
            <Row key={owners[index].address} className={classes.owner}>
              <Col xs={4}>
                <Field
                  className={classes.name}
                  name={getOwnerNameBy(index)}
                  component={TextField}
                  type="text"
                  validate={required}
                  defaultValue={`Owner #${index + 1}`}
                  placeholder="Owner Name*"
                  text="Owner Name"
                />
              </Col>
              <Col xs={7}>
                <Row className={classes.ownerAddresses}>
                  <Identicon address={owners[index]} diameter={32} />
                  <Paragraph size="md" color="disabled" noMargin className={classes.address}>
                    {owners[index]}
                  </Paragraph>
                  <Link className={classes.open} to={getEtherScanLink(owners[index], network)} target="_blank">
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Row>
              </Col>
            </Row>
          )) }
        </Block>
      </React.Fragment>
    )
  }
}

const OwnerListPage = withStyles(styles)(OwnerListComponent)

const OwnerList = ({ updateInitialProps }: Object, network: string) => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <OwnerListPage
        network={network}
        updateInitialProps={updateInitialProps}
        values={values}
      />
    </OpenPaper>
  </React.Fragment>
)

export default OwnerList
