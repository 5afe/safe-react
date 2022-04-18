import { ReactElement } from 'react'
import { Button, Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { OPEN_SAFE_ROUTE } from 'src/routes/routes'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import SuccessSvg from 'src/assets/icons/safe-created.svg'

const CreateNewSafe = (): ReactElement => {
  return (
    <>
      <BodyImage>
        <Img alt="Vault" height={92} src={SuccessSvg} />
      </BodyImage>

      <Button size="lg" color="primary" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}>
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
