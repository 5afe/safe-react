import * as React from 'react'

import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { boldFont, sm } from 'src/theme/variables'

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

interface Props {
  buttonLabels?: string[]
  currentStep: number
  disabled: boolean
  firstPage: boolean
  lastPage: boolean
  penultimate: boolean
  onPrevious: () => void
}

const Controls = ({
  buttonLabels,
  currentStep,
  disabled,
  firstPage,
  lastPage,
  onPrevious,
  penultimate,
}: Props): React.ReactElement => {
  const back = firstPage ? 'Cancel' : 'Back'

  let next
  if (!buttonLabels) {
    // eslint-disable-next-line
    next = firstPage ? 'Start' : penultimate ? 'Review' : lastPage ? 'Submit' : 'Next'
  } else {
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
