// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'

type ControlProps = {
  next: string,
  back: string,
  onPrevious: () => void,
  firstPage: boolean,
  disabled: boolean,
}

const controlStyle = {
  backgroundColor: 'white',
  padding: '8px',
  borderBottomRightRadius: '4px',
  borderBottomLeftRadius: '4px',
}

const ControlButtons = ({
  next, back, firstPage, onPrevious, disabled,
}: ControlProps) => (
  <Row style={controlStyle} align="end" margin="lg" grow>
    <Col xs={12} end="xs">
      <Button
        type="button"
        disabled={firstPage || disabled}
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
      firstPage={firstPage}
      onPrevious={onPrevious}
    />
)

export default Controls
