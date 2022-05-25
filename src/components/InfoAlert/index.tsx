import MuiAlert from '@material-ui/lab/Alert'
import useCachedState from 'src/utils/storage/useCachedState'
import Paragraph from 'src/components/layout/Paragraph'
import { ReactElement } from 'react'

type InfoAlertProps = {
  title: string
  text: string
  id: string
}

const InfoAlert = (props: InfoAlertProps): ReactElement | null => {
  const [isClosed, setClosed] = useCachedState<boolean>(`${props.id}Closed`)

  return isClosed ? null : (
    <MuiAlert severity="info" onClose={() => setClosed(true)} style={{ margin: '0 20px 26px 0' }}>
      <Paragraph style={{ fontWeight: 'bold', margin: '0 0 0.5em' }}>{props.title}</Paragraph>

      <Paragraph noMargin>{props.text}</Paragraph>
    </MuiAlert>
  )
}

export default InfoAlert
