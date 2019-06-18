// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import SelectField from '~/components/forms/SelectField'
import MenuItem from '@material-ui/core/MenuItem'
import {
  composeValidators, minValue, mustBeInteger, required,
} from '~/components/forms/validator'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import type { Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  threshold: number,
  owners: List<Owner>,
  onChangeThreshold: Function,
}

const THRESHOLD_FIELD_NAME = 'threshold'

const ChangeThreshold = ({
  onClose, owners, threshold, classes, onChangeThreshold,
}: Props) => {
  const handleSubmit = (values) => {
    const newThreshold = values[THRESHOLD_FIELD_NAME]

    onChangeThreshold(newThreshold)
  }

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.headingText} weight="bolder" noMargin>
          Change required confirmations
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.modalContent}>
        <GnoForm onSubmit={handleSubmit} initialValues={{ threshold: threshold.toString() }}>
          {() => (
            <React.Fragment>
              <Row>
                <Paragraph>
                  Every transaction outside any specified daily limits, needs to be confirmed by all specified owners.
                  If no daily limits are set, all owners will need to sign for transactions.
                </Paragraph>
              </Row>
              <Row>
                <Paragraph weight="bolder">
                  Any transaction over any daily limit requires the confirmation of:
                </Paragraph>
              </Row>
              <Row margin="xl" align="center">
                <Col xs={2}>
                  <Field
                    name={THRESHOLD_FIELD_NAME}
                    component={SelectField}
                    validate={composeValidators(required, mustBeInteger, minValue(1))}
                    data-testid="threshold-select-input"
                  >
                    {[...Array(Number(owners.size))].map((x, index) => (
                      <MenuItem key={index} value={`${index + 1}`}>
                        {index + 1}
                      </MenuItem>
                    ))}
                  </Field>
                </Col>
                <Col xs={10}>
                  <Paragraph size="lg" color="primary" noMargin className={classes.ownersText}>
                    out of
                    {' '}
                    {owners.size}
                    {' '}
owner(s)
                  </Paragraph>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </GnoForm>
      </Block>
      <Hairline style={{ position: 'absolute', bottom: 85 }} />
      <Row align="center" className={classes.buttonRow}>
        <Button className={classes.button} minWidth={140} onClick={onClose}>
          BACK
        </Button>
        <Button color="primary" className={classes.button} minWidth={140} onClick={onClose} variant="contained">
          CHANGE
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default withStyles(styles)(ChangeThreshold)
