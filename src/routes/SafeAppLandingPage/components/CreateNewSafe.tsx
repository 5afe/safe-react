import { Button, Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { OPEN_SAFE_ROUTE, SAFE_ROUTES } from 'src/routes/routes'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import SuccessSvg from 'src/assets/icons/safe-created.svg'

const CreateNewSafe = ({ safeAppUrl }: { safeAppUrl: string }): React.ReactElement => {
  const openSafeLink = `${OPEN_SAFE_ROUTE}?redirect=${encodeURIComponent(`${SAFE_ROUTES.APPS}?appUrl=${safeAppUrl}`)}`

  return (
    <>
      <BodyImage>
        <Img alt="Vault" height={92} src={SuccessSvg} />
      </BodyImage>

      <Button size="lg" color="primary" variant="contained" component={Link} to={openSafeLink}>
        <Text size="xl" color="white">
          Create new Safe
        </Text>
      </Button>
    </>
  )
}

export default CreateNewSafe

const BodyImage = styled.div`
  margin: 30px 0;
`
