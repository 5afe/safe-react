// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'

type ControlProps = {
  next: string,
  onPrevious: () => void,
  firstPage: boolean,
  submitting: boolean,
}

const ControlButtons = ({
  next, firstPage, onPrevious, submitting,
}: ControlProps) => (
  <React.Fragment>
    <Button
      type="button"
      disabled={firstPage || submitting}
      onClick={onPrevious}
    >
      Back
    </Button>
    <Button
      variant="raised"
      color="primary"
      type="submit"
      disabled={submitting}
    >
      {next}
    </Button>
  </React.Fragment>
)

type Props = {
  finishedTx: boolean,
  finishedButton: React$Node,
  onPrevious: () => void,
  firstPage: boolean,
  lastPage: boolean,
  submitting: boolean,
}

const Controls = ({
  finishedTx, finishedButton, onPrevious, firstPage, lastPage, submitting,
}: Props) => (
  finishedTx
    ? <React.Fragment>{finishedButton}</React.Fragment>
    : <ControlButtons
      submitting={submitting}
      next={lastPage ? 'Finish' : 'Next'}
      firstPage={firstPage}
      onPrevious={onPrevious}
    />
)

export default Controls
