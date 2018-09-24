// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import { sm } from '~/theme/variables'

type ControlProps = {
  next: string,
  back: string,
  onPrevious: () => void,
  disabled: boolean,
}

const controlStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const firstButtonStyle = {
  marginRight: sm,
}

const ControlButtons = ({
  next, back, onPrevious, disabled,
}: ControlProps) => (
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
        size="small"
        variant="raised"
        color="primary"
        type="submit"
        disabled={disabled}
      >
        {next}
      </Button>
    </Col>
  </Row>
)

type Props = {
  finishedTx: boolean,
  finishedButton: React$Node,
  onPrevious: () => void,
  firstPage: boolean,
  lastPage: boolean,
  disabled: boolean,
}

const Controls = ({
  finishedTx, finishedButton, onPrevious, firstPage, lastPage, disabled,
}: Props) => (
  finishedTx
    ? <React.Fragment>{finishedButton}</React.Fragment>
    : <ControlButtons
      disabled={disabled}
      back={firstPage ? 'Cancel' : 'Back'}
      // eslint-disable-next-line
      next={firstPage ? 'Start' : lastPage ? 'Finish' : 'Next'}
      onPrevious={onPrevious}
    />
)

export default Controls
