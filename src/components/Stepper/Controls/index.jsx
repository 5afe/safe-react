// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import { sm, boldFont } from '~/theme/variables'

const controlStyle = {
  backgroundColor: 'white',
  padding: sm,
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
}

const Controls = ({
  onPrevious, firstPage, penultimate, lastPage, disabled,
}: Props) => {
  // eslint-disable-next-line
  const next = firstPage ? 'Start' : penultimate ? 'Review' : lastPage ? 'Submit' : 'Next'
  const back = firstPage ? 'Cancel' : 'Back'

  return (
    <Row style={controlStyle} align="end" grow>
      <Col xs={12} end="xs">
        <Button
          style={firstButtonStyle}
          type="button"
          onClick={onPrevious}
          size="small"
        >
          {back}
        </Button>
        <Button
          style={secondButtonStyle}
          size="small"
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled}
        >
          {next}
        </Button>
      </Col>
    </Row>
  )
}

export default Controls
