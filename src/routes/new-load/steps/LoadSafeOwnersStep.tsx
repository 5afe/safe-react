import { makeStyles, TableContainer } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { useForm } from 'react-final-form'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { disabled, extraSmallFontSize, lg, md, screenSm, sm } from 'src/theme/variables'
import { minMaxLength } from 'src/components/forms/validator'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo } from 'src/config'

export const loadSafeOwnersStepLabel = 'Owners'

export const FIELD_SAFE_OWNER_LIST = 'safeOwnerList'

function LoadSafeOwnersStep(): ReactElement {
  const loadSafeForm = useForm()

  const ownersWithName = loadSafeForm.getState().values[FIELD_SAFE_OWNER_LIST]

  const classes = useStyles()

  return (
    <>
      <Block className={classes.title}>
        <Paragraph color="primary" noMargin size="md" data-testid="load-safe-step-two">
          {`This Safe has ${ownersWithName.length} owners. Optional: Provide a name for each owner.`}
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
          {ownersWithName.map(({ address, name }, index) => {
            return (
              <Row className={classes.owner} key={address} data-testid="owner-row">
                <Col className={classes.ownerName} xs={4}>
                  <Field
                    className={classes.name}
                    component={TextField}
                    initialValue={name}
                    name={`owner-address-${address}`}
                    placeholder="Owner Name"
                    text="Owner Name"
                    type="text"
                    validate={minMaxLength(0, 50)}
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

export default LoadSafeOwnersStep

const useStyles = makeStyles({
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
