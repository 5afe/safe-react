// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Field from '~/components/forms/Field'
import SelectField from '~/components/forms/SelectField'
import { composeValidators, minValue, mustBeInteger, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { FIELD_CONFIRMATIONS, getNumOwnersFrom } from '~/routes/open/components/fields'
import { md } from '~/theme/variables'

type Props = {
  classes: Object,
  values: Object,
}

const styles = () => ({
  owners: {
    paddingLeft: md,
  },
})

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  const numOwners = getNumOwnersFrom(values)
  if (numOwners < Number.parseInt(values[FIELD_CONFIRMATIONS], 10)) {
    errors[FIELD_CONFIRMATIONS] = CONFIRMATIONS_ERROR
  }

  return errors
}

const SafeThreshold = ({ classes, values }: Props) => {
  const numOwners = getNumOwnersFrom(values)

  return (
    <React.Fragment>
      <Block margin="xs">
        <Paragraph noMargin size="md" color="primary" weight="bolder">
          Any transaction requires the confirmation of:
        </Paragraph>
      </Block>
      <Row margin="xl" align="center">
        <Col xs={2}>
          <Field
            name={FIELD_CONFIRMATIONS}
            component={SelectField}
            validate={composeValidators(
              required,
              mustBeInteger,
              minValue(1),
            )}
          >
            {
              [...Array(Number(numOwners))].map((x, index) => (
                <MenuItem key={`selectOwner${index}`} value={`${index + 1}`}>{index + 1}</MenuItem>
              ))
            }
          </Field>
        </Col>
        <Col xs={10}>
          <Paragraph size="lg" color="primary" noMargin className={classes.owners}>
            out of {numOwners} owner(s)
          </Paragraph>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const SafeThresholdForm = withStyles(styles)(SafeThreshold)

const SafeOwnersPage = () => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} container={450}>
      <SafeThresholdForm values={values} />
    </OpenPaper>
  </React.Fragment>
)


export default SafeOwnersPage
