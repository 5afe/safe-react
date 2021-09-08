import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import DetailsForm, { safeFieldsValidation } from 'src/routes/load/components/DetailsForm'
import OwnerList from 'src/routes/load/components/OwnerList'
import ReviewInformation from 'src/routes/load/components/ReviewInformation'

import { history } from 'src/routes/routes'
import { secondary, sm } from 'src/theme/variables'
import { LoadFormValues } from 'src/routes/load/container/Load'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_SAFE_NAME } from './fields'

const steps = ['Name and address', 'Owners', 'Review']
const buttonLabels = ['Next', 'Review', 'Add']

const iconStyle = {
  color: secondary,
  padding: sm,
  marginRight: '5px',
}

const back = () => {
  history.goBack()
}

const formMutators = {
  setValue: ([field, value], state, { changeValue }) => {
    changeValue(state, field, () => value)
  },
}

interface LayoutProps {
  provider?: string
  userAddress: string
  onLoadSafeSubmit: (values: LoadFormValues) => void
}

const Layout = ({ onLoadSafeSubmit, provider, userAddress }: LayoutProps): ReactElement => {
  const { safeAddress } = useParams<{ safeAddress?: string }>()
  const savedName = useSelector((state) => (safeAddress ? addressBookName(state, { address: safeAddress }) : ''))
  const randomName = useMnemonicSafeName()

  const initialValues = {
    [FIELD_LOAD_SAFE_NAME]: savedName || randomName,
    [FIELD_LOAD_ADDRESS]: safeAddress,
  }

  return (
    <>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton disableRipple onClick={back} style={iconStyle}>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Add existing Safe</Heading>
          </Row>
          <Stepper<LoadFormValues>
            initialValues={initialValues}
            buttonLabels={buttonLabels}
            mutators={formMutators}
            onSubmit={onLoadSafeSubmit}
            steps={steps}
            testId="load-safe-form"
          >
            <StepperPage validate={safeFieldsValidation} component={DetailsForm} />
            <StepperPage component={OwnerList} />
            <StepperPage userAddress={userAddress} component={ReviewInformation} />
          </Stepper>
        </Block>
      ) : (
        <div>No account detected</div>
      )}
    </>
  )
}

export default Layout
