// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import IconButton from '@material-ui/core/IconButton'
import ReviewInformation from '~/routes/load/components/ReviewInformation'
import DetailsForm, { safeFieldsValidation } from '~/routes/load/components/DetailsForm'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { history } from '~/store'
import { secondary } from '~/theme/variables'

const getSteps = () => [
  'Details', 'Review',
]

type Props = {
  provider: string,
  network: string,
  onLoadSafeSubmit: () => Promise<void>,
}

const iconStyle = {
  color: secondary,
  width: '32px',
  height: '32px',
}

const back = () => {
  history.goBack()
}

const Layout = ({
  provider, onLoadSafeSubmit, network,
}: Props) => {
  const steps = getSteps()

  return (
    <React.Fragment>
      { provider
        ? (
          <Block>
            <Row align="center">
              <IconButton onClick={back} style={iconStyle} disableRipple>
                <ChevronLeft />
              </IconButton>
              <Heading tag="h2">Load existing Safe</Heading>
            </Row>
            <Stepper
              onSubmit={onLoadSafeSubmit}
              steps={steps}
            >
              <Stepper.Page validate={safeFieldsValidation}>
                { DetailsForm }
              </Stepper.Page>
              <Stepper.Page network={network}>
                { ReviewInformation }
              </Stepper.Page>
            </Stepper>
          </Block>
        )
        : <div>No metamask detected</div>
      }
    </React.Fragment>
  )
}

export default Layout
