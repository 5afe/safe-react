// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'

type NextButtonProps = {
  text: string
}

const NextButton = ({ text }: NextButtonProps) => (
  <Button
    variant="raised"
    color="primary"
    type="submit"
  >
    {text}
  </Button>
)

const GoButton = () => (
  <Link to="/welcome">
    <NextButton text="GO" />
  </Link>
)

type ControlProps = {
  next: string,
  onPrevious: () => void,
  firstPage: boolean,
}

const ControlButtons = ({ next, firstPage, onPrevious }: ControlProps) => (
  <React.Fragment>
    <Button
      type="button"
      disabled={firstPage}
      onClick={onPrevious}
    >
      Back
    </Button>
    <NextButton text={next} />
  </React.Fragment>
)

type Props = {
  finishedTx: boolean,
  onPrevious: () => void,
  firstPage: boolean,
  lastPage: boolean,
}

const Controls = ({
  finishedTx, onPrevious, firstPage, lastPage,
}: Props) => (
  <React.Fragment>
    { finishedTx
      ? <GoButton />
      : <ControlButtons
        next={lastPage ? 'Finish' : 'Next'}
        firstPage={firstPage}
        onPrevious={onPrevious}
      />
    }
  </React.Fragment>
)

export default Controls
