import MuiAlert from '@material-ui/lab/Alert'
import useCachedState from 'src/utils/storage/useCachedState'
import Paragraph from 'src/components/layout/Paragraph'
import { ReactElement } from 'react'

type InfoAlertProps = {
  title: string
  text: string
  key: string
}

const InfoAlert = (props: InfoAlertProps): ReactElement | null => {
  const [isClosed, setClosed] = useCachedState<boolean>(props.key)

  return isClosed ? null : (
    <MuiAlert severity="info" onClose={() => setClosed(true)} style={{ marginBottom: '26px' }}>
      <Paragraph style={{ fontWeight: 'bold', margin: '0 0 0.5em' }}>{props.title}</Paragraph>

      <Paragraph noMargin>{props.text}</Paragraph>
    </MuiAlert>
  )
}

export default InfoAlert
