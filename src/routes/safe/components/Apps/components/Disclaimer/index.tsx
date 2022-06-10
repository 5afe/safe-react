import { Icon, FixedDialog } from '@gnosis.pm/safe-react-components'
import Grid from '@material-ui/core/Grid'
import Slider, { SliderItem } from './Slider'
import LegalDisclaimer from './LegalDisclaimer'

interface OwnProps {
  onCancel: () => void
  onConfirm: () => void
}

const SafeAppsDisclaimer = ({ onCancel, onConfirm }: OwnProps): JSX.Element => {
  return (
    <FixedDialog
      body={
        <Grid container justifyContent="center" alignItems="center" direction="column">
          <Icon type="apps" size="md" color="primary" />
          <Slider>
            <SliderItem>
              <LegalDisclaimer />
            </SliderItem>
            <SliderItem>
              <p>One</p>
            </SliderItem>
            <SliderItem>
              <p>two</p>
            </SliderItem>
          </Slider>
        </Grid>
      }
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="Disclaimer"
    />
  )
}

export default SafeAppsDisclaimer
