import TableContainer from '@material-ui/core/TableContainer'
import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { FIELD_LOAD_ADDRESS, THRESHOLD } from 'src/routes/load/components/fields'
import { getOwnerAddressBy, getOwnerNameBy } from 'src/routes/open/components/fields'
import { border, disabled, extraSmallFontSize, lg, md, screenSm, sm } from 'src/theme/variables'

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

const calculateSafeValues = (owners, threshold, values) => {
  const initialValues = { ...values }
  for (let i = 0; i < owners.length; i += 1) {
    initialValues[getOwnerAddressBy(i)] = owners[i]
  }
  initialValues[THRESHOLD] = threshold
  return initialValues
}

const OwnerListComponent = (props) => {
  const [owners, setOwners] = useState([])
  const { classes, updateInitialProps, values } = props

  useEffect(() => {
    let isCurrent = true

    const fetchSafe = async () => {
      const safeAddress = values[FIELD_LOAD_ADDRESS]
      const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
      const safeOwners = await gnosisSafe.getOwners()
      const threshold = await gnosisSafe.getThreshold()

      if (isCurrent && owners) {
        const sortedOwners = safeOwners.sort()
        const initialValues = calculateSafeValues(sortedOwners, threshold, values)
        updateInitialProps(initialValues)
        setOwners(sortedOwners)
      }
    }

    fetchSafe()

    return () => {
      isCurrent = false
    }
  }, [owners, updateInitialProps, values])

  return (
    <>
      <Block className={classes.title}>
        <Paragraph color="primary" noMargin size="md" data-testid="load-safe-step-two">
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
            <Row className={classes.owner} key={address} data-testid="owner-row">
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
                  testId={`load-safe-owner-name-${index}`}
                />
              </Col>
              <Col xs={8}>
                <Row className={classes.ownerAddresses}>
                  <Identicon address={address} diameter={32} />
                  <Paragraph className={classes.address} color="disabled" noMargin size="md">
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

const OwnerListPage = withStyles(styles as any)(OwnerListComponent)

const OwnerList = ({ updateInitialProps }, network) => (controls, { values }) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <OwnerListPage network={network} updateInitialProps={updateInitialProps} values={values} />
    </OpenPaper>
  </>
)

export default OwnerList
