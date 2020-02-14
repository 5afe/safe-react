// @flow
import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Block from '~/components/layout/Block'
import Field from '~/components/forms/Field'
import { required } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import {
  sm,
  md,
  lg,
  border,
  disabled,
  extraSmallFontSize,
  screenSm,
} from '~/theme/variables'
import {
  getOwnerNameBy,
  getOwnerAddressBy,
} from '~/routes/open/components/fields'
import { FIELD_LOAD_ADDRESS, THRESHOLD } from '~/routes/load/components/fields'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'

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
  ownerName: {
    marginBottom: '15px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  ownerAddresses: {
    alignItems: 'center',
    marginLeft: `${sm}`,
  },
  address: {
    paddingLeft: '6px',
    marginRight: sm,
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
    color: disabled,
    fontSize: extraSmallFontSize,
  },
  name: {
    marginRight: `${sm}`,
  },
})

type Props = {
  values: Object,
  classes: Object,
  updateInitialProps: (initialValues: Object) => void,
}

const calculateSafeValues = (
  owners: Array<string>,
  threshold: Number,
  values: Object
) => {
  const initialValues = { ...values }
  for (let i = 0; i < owners.length; i += 1) {
    initialValues[getOwnerAddressBy(i)] = owners[i]
  }
  initialValues[THRESHOLD] = threshold
  return initialValues
}

const OwnerListComponent = (props: Props) => {
  const [owners, setOwners] = useState<Array<string>>([])
  const { values, updateInitialProps, classes } = props

  useEffect(() => {
    let isCurrent = true

    const fetchSafe = async () => {
      const safeAddress = values[FIELD_LOAD_ADDRESS]
      const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
      const safeOwners = await gnosisSafe.getOwners()
      const threshold = await gnosisSafe.getThreshold()

      if (isCurrent && owners) {
        const sortedOwners = safeOwners.sort()
        const initialValues = calculateSafeValues(
          sortedOwners,
          threshold,
          values
        )
        updateInitialProps(initialValues)
        setOwners(sortedOwners)
      }
    }

    fetchSafe()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <>
      <Block className={classes.title}>
        <Paragraph noMargin size="md" color="primary">
          {`This Safe has ${owners.length} owners. Optional: Provide a name for each owner.`}
        </Paragraph>
      </Block>
      <Hairline />
      <TableContainer>
        <Row className={classes.header}>
          <Col xs={4}>NAME</Col>
          <Col xs={8}>ADDRESS</Col>
        </Row>
        <Hairline />
        <Block margin="md" padding="md">
          {owners.map((address, index) => (
            <Row key={address} className={classes.owner}>
              <Col className={classes.ownerName} xs={4}>
                <Field
                  className={classes.name}
                  component={TextField}
                  initialValue={`Owner #${index + 1}`}
                  name={getOwnerNameBy(index)}
                  placeholder="Owner Name*"
                  text="Owner Name"
                  type="text"
                  validate={required}
                />
              </Col>
              <Col xs={8}>
                <Row className={classes.ownerAddresses}>
                  <Identicon address={address} diameter={32} />
                  <Paragraph
                    size="md"
                    color="disabled"
                    noMargin
                    className={classes.address}
                  >
                    {address}
                  </Paragraph>
                  <CopyBtn content={address} />
                  <EtherscanBtn type="address" value={address} />
                </Row>
              </Col>
            </Row>
          ))}
        </Block>
      </TableContainer>
    </>
  )
}

const OwnerListPage = withStyles(styles)(OwnerListComponent)

const OwnerList = ({ updateInitialProps }: Object, network: string) => (
  controls: React$Node,
  { values }: Object
) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <OwnerListPage
        network={network}
        updateInitialProps={updateInitialProps}
        values={values}
      />
    </OpenPaper>
  </>
)

export default OwnerList
