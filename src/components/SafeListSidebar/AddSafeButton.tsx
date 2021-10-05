import { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { Text } from '@gnosis.pm/safe-react-components'
import { WELCOME_ROUTE } from 'src/routes/routes'

interface Props {
  onAdd: () => unknown
}

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 10px 44px;

  & > button {
    transform: scale(0.8);
    transform-origin: 0 50%;

    p {
      position: absolute;
      white-space: nowrap;
      left: 50px;
      margin-top: 3px;
      text-transform: none;
      font-size: 19px;
    }
  }
`

const AddSafeButton = ({ onAdd }: Props): ReactElement => {
  return (
    <StyledLink onClick={onAdd} to={WELCOME_ROUTE}>
      <Fab color="secondary" size="small" aria-label="Add Safe">
        <AddIcon />

        <Text color="primary" size="xl" strong>
          Add Safe
        </Text>
      </Fab>
    </StyledLink>
  )
}

export default AddSafeButton
