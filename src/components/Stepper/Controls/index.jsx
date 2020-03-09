// @flow
import * as React from 'react'

import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import { boldFont, sm } from '~/theme/variables'

const controlStyle = {
  backgroundColor: 'white',
  padding: sm,
  borderRadius: sm,
}

const firstButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

const secondButtonStyle = {
  fontWeight: boldFont,
}

type Props = {
  onPrevious: () => void,
  firstPage: boolean,
  lastPage: boolean,
  disabled: boolean,
  penultimate: boolean,
  currentStep?: number,
  buttonLabels?: Array<string>,
}

const Controls = ({ buttonLabels, currentStep, disabled, firstPage, lastPage, onPrevious, penultimate }: Props) => {
  const back = firstPage ? 'Cancel' : 'Back'

  let next
  if (!buttonLabels) {
    // eslint-disable-next-line
    next = firstPage ? 'Start' : penultimate ? 'Review' : lastPage ? 'Submit' : 'Next'
  } else {
    // $FlowFixMe
    next = buttonLabels[currentStep]
  }

  return (
    <Row align="end" grow style={controlStyle}>
      <Col end="xs" xs={12}>
        <Button onClick={onPrevious} size="small" style={firstButtonStyle} type="button">
          {back}
        </Button>
        <Button
          color="primary"
          disabled={disabled}
          size="small"
          style={secondButtonStyle}
          type="submit"
          variant="contained"
        >
          {next}
        </Button>
      </Col>
    </Row>
  )
}

export default Controls
