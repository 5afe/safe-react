import { makeStyles } from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, minMaxLength, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'

import { formatAddressListToAddressBookNames } from 'src/logic/addressBook/utils'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { FIELD_LOAD_ADDRESS, THRESHOLD } from 'src/routes/load/components/fields'
import { getOwnerAddressBy, getOwnerNameBy } from 'src/routes/open/components/fields'
import { styles } from './styles'
import { getExplorerInfo } from 'src/config'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

const calculateSafeValues = (owners, threshold, values) => {
  const initialValues = { ...values }
  for (let i = 0; i < owners.length; i += 1) {
    initialValues[getOwnerAddressBy(i)] = owners[i]
  }
  initialValues[THRESHOLD] = threshold
  return initialValues
}

const useAddressBookForOwnersNames = (ownersList: string[]): AddressBookEntry[] => {
  const addressBook = useSelector(addressBookSelector)

  return formatAddressListToAddressBookNames(addressBook, ownersList)
}

const useStyles = makeStyles(styles)

const OwnerListComponent = (props) => {
  const [owners, setOwners] = useState<string[]>([])
  const classes = useStyles()
  const { updateInitialProps, values } = props

  const ownersWithNames = useAddressBookForOwnersNames(owners)

  useEffect(() => {
    let isCurrent = true

    const fetchSafe = async () => {
      const safeAddress = values[FIELD_LOAD_ADDRESS]
      const gnosisSafe = getGnosisSafeInstanceAt(safeAddress)
      const safeOwners = await gnosisSafe.methods.getOwners().call()
      const threshold = await gnosisSafe.methods.getThreshold().call()

      if (isCurrent) {
        const sortedOwners = safeOwners.slice().sort()
        const initialValues = calculateSafeValues(sortedOwners, threshold, values)
        updateInitialProps(initialValues)
        setOwners(sortedOwners)
      }
    }

    fetchSafe()

    return () => {
      isCurrent = false
    }
  }, [updateInitialProps, values])

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
          {ownersWithNames.map(({ address, name }, index) => {
            const ownerName = name || `Owner #${index + 1}`
            return (
              <Row className={classes.owner} key={address} data-testid="owner-row">
                <Col className={classes.ownerName} xs={4}>
                  <Field
                    className={classes.name}
                    component={TextField}
                    initialValue={ownerName}
                    name={getOwnerNameBy(index)}
                    placeholder="Owner Name*"
                    text="Owner Name"
                    type="text"
                    validate={composeValidators(required, minMaxLength(1, 50))}
                    testId={`load-safe-owner-name-${index}`}
                  />
                </Col>
                <Col xs={8}>
                  <Row className={classes.ownerAddresses}>
                    <EthHashInfo hash={address} showAvatar showCopyBtn explorerUrl={getExplorerInfo(address)} />
                  </Row>
                </Col>
              </Row>
            )
          })}
        </Block>
      </TableContainer>
    </>
  )
}

const OwnerList = ({ updateInitialProps }, network) =>
  function LoadSafeOwnerList(controls, { values }): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <OwnerListComponent network={network} updateInitialProps={updateInitialProps} values={values} />
        </OpenPaper>
      </>
    )
  }

export default OwnerList
