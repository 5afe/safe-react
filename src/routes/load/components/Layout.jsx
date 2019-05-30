// @flow
import * as React from 'react'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import Stepper from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import IconButton from '@material-ui/core/IconButton'
import ReviewInformation from '~/routes/load/components/ReviewInformation'
import DetailsForm, { safeFieldsValidation } from '~/routes/load/components/DetailsForm'
import { history } from '~/store'
import { secondary } from '~/theme/variables'
import { type SelectorProps } from '~/routes/load/container/selector'

const getSteps = () => ['Details', 'Review']

type Props = SelectorProps & {
  onLoadSafeSubmit: (values: Object) => Promise<void>,
}

const iconStyle = {
  color: secondary,
  padding: '8px',
  marginRight: '5px',
}

const back = () => {
  history.goBack()
}

const Layout = ({
  provider, onLoadSafeSubmit, network, userAddress,
}: Props) => {
  const steps = getSteps()

  return (
    <React.Fragment>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton onClick={back} style={iconStyle} disableRipple>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Load existing Safe</Heading>
          </Row>
          <Stepper onSubmit={onLoadSafeSubmit} steps={steps} testId="load-safe-form">
            <Stepper.Page validate={safeFieldsValidation}>{DetailsForm}</Stepper.Page>
            <Stepper.Page network={network} userAddress={userAddress}>
              {ReviewInformation}
            </Stepper.Page>
          </Stepper>
        </Block>
      ) : (
        <div>No metamask detected</div>
      )}
    </React.Fragment>
  )
}

export default Layout
