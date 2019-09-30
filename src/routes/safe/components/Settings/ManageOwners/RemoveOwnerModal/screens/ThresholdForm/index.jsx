// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import SelectField from '~/components/forms/SelectField'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import type { Owner } from '~/routes/safe/store/models/owner'
import {
  composeValidators, required, minValue, maxValue, mustBeInteger,
} from '~/components/forms/validator'
import { styles } from './style'

export const REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID = 'remove-owner-threshold-next-btn'

type Props = {
  onClose: () => void,
  classes: Object,
  owners: List<Owner>,
  threshold: number,
  onClickBack: Function,
  onSubmit: Function,
}

const ThresholdForm = ({
  classes, onClose, owners, threshold, onClickBack, onSubmit,
}: Props) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const defaultThreshold = threshold > 1 ? threshold - 1 : threshold

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 3</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit} initialValues={{ threshold: defaultThreshold.toString() }}>
        {() => {
          const numOptions = owners.size > 1 ? owners.size - 1 : 1

          return (
            <>
              <Block className={classes.formContainer}>
                <Row>
                  <Paragraph weight="bolder" className={classes.headingText}>
                    Set the required owner confirmations:
                  </Paragraph>
                </Row>
                <Row>
                  <Paragraph weight="bolder">
                    Any transaction over any daily limit requires the confirmation of:
                  </Paragraph>
                </Row>
                <Row margin="xl" align="center" className={classes.inputRow}>
                  <Col xs={2}>
                    <Field
                      name="threshold"
                      render={(props) => (
                        <>
                          <SelectField {...props} disableError>
                            {[...Array(Number(numOptions))].map((x, index) => (
                              <MenuItem key={index} value={`${index + 1}`}>
                                {index + 1}
                              </MenuItem>
                            ))}
                          </SelectField>
                          {props.meta.error && props.meta.touched && (
                            <Paragraph className={classes.errorText} noMargin color="error">
                              {props.meta.error}
                            </Paragraph>
                          )}
                        </>
                      )}
                      validate={composeValidators(required, mustBeInteger, minValue(1), maxValue(numOptions))}
                      data-testid="threshold-select-input"
                    />
                  </Col>
                  <Col xs={10}>
                    <Paragraph size="lg" color="primary" noMargin className={classes.ownersText}>
                      out of
                      {' '}
                      {owners.size - 1}
                      {' '}
owner(s)
                    </Paragraph>
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} minHeight={42} onClick={onClickBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  minHeight={42}
                  minWidth={140}
                  color="primary"
                  data-testid={REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID}
                >
                  Review
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ThresholdForm)
