// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'

type ControlProps = {
  next: string,
  onPrevious: () => void,
  firstPage: boolean,
  disabled: boolean,
}

const ControlButtons = ({
  next, firstPage, onPrevious, disabled,
}: ControlProps) => (
  <React.Fragment>
    <Button
      type="button"
      disabled={firstPage || disabled}
      onClick={onPrevious}
    >
      Back
    </Button>
    <Button
      variant="raised"
      color="primary"
      type="submit"
      disabled={disabled}
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
  disabled: boolean,
}

const Controls = ({
  finishedTx, finishedButton, onPrevious, firstPage, lastPage, disabled,
}: Props) => (
  finishedTx
    ? <React.Fragment>{finishedButton}</React.Fragment>
    : <ControlButtons
      disabled={disabled}
      next={lastPage ? 'Finish' : 'Next'}
      firstPage={firstPage}
      onPrevious={onPrevious}
    />
)

export default Controls
