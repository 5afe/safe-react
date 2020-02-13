// @flow

import React from 'react'
import styled from 'styled-components'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'

// TODO: move these styles to a generic place
import { styles } from '../../Settings/style'

const Wrapper = styled.div``

const Item = styled.div`
  border-bottom: solid 2px rgb(232, 231, 230);

  .container {
    display: flex;
    align-items: flex-end;
  }
`

const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`

const List = ({ items, activeItem, onItemClick, classes }: any) => {
  return (
    <Wrapper>
      {items.map(i => (
        <Item
          key={i.id}
          className={cn(classes.menuOption, activeItem === i.id && classes.active)}
          onClick={() => onItemClick(i.id)}
        >
          <div className="container">
            {i.iconUrl && <IconImg src={i.iconUrl} alt={i.name} />}
            <span>{i.name}</span>
          </div>
        </Item>
      ))}
    </Wrapper>
  )
}

export default withStyles(styles)(List)
