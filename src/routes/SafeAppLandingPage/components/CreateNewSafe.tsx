import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { Button, Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import SuccessSvg from 'src/assets/icons/safe-created.svg'
import { OPEN_SAFE_ROUTE, SAFE_ROUTES } from 'src/routes/routes'

type CreateNewSafeProps = {
  safeAppUrl: string
}

const CreateNewSafe = ({ safeAppUrl }: CreateNewSafeProps): ReactElement => {
  const createSafeLink = `${OPEN_SAFE_ROUTE}?redirect=${encodeURIComponent(`${SAFE_ROUTES.APPS}?appUrl=${safeAppUrl}`)}`

  return (
    <>
      <img alt="Vault" height={92} src={SuccessSvg} />

      <StyledCreateButton size="lg" color="primary" variant="contained" component={Link} to={createSafeLink}>
        <Text size="xl" color="white">
          Create new Safe
        </Text>
      </StyledCreateButton>
    </>
  )
}

export default CreateNewSafe

const StyledCreateButton = styled(Button)`
  margin-top: 30px;
`
