import { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { Text } from '@gnosis.pm/safe-react-components'
import { WELCOME_ROUTE } from 'src/routes/routes'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from '../Track'

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
    <Track {...OVERVIEW_EVENTS.ADD_SAFE}>
      <StyledLink onClick={onAdd} to={WELCOME_ROUTE}>
        <Fab color="secondary" size="small" aria-label="Add Safe">
          <AddIcon />

          <Text color="primary" size="xl" strong>
            Add Safe
          </Text>
        </Fab>
      </StyledLink>
    </Track>
  )
}

export default AddSafeButton
