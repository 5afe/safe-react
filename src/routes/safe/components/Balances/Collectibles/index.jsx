// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import Card from '@material-ui/core/Card'
import {
  screenSm, fontColor,
} from '~/theme/variables'
import Cryptokitty from './components/Cryptokitty'
import CryptoKittiesAvatar from './img/cryptokitties.png'

const styles = () => ({
  cardInner: {
    boxSizing: 'border-box',
    maxWidth: '100%',
    padding: '52px 54px',
  },
  gridRow: {
    boxSizing: 'border-box',
    columnGap: '30px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    maxWidth: '100%',
    rowGap: '45px',

    [`@media (min-width: ${screenSm}px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxSizing: 'border-box',
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    display: 'flex',
    minHeight: '250px',
    minWidth: '0',
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    margin: '0 0 18px',
  },
  titleImg: {
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    borderRadius: '50%',
    height: '45px',
    margin: '0 10px 0 0',
    width: '45px',
  },
  titleText: {
    color: fontColor,
    fontSize: '18px',
    fontWeight: 'normal',
    lineHeight: '1.2',
    margin: '0',
  },
})

type Props = {
  classes: Object,
}

const data = [
  {
    image: CryptoKittiesAvatar,
    title: 'CryptoKitties',
    type: 'cryptokitties',
    data: [
      {
        backgroundColor: '#f0efee',
        image: 'https://via.placeholder.com/155',
        text: 'Serpent Gen 123456',
        title: 'Mystical Potato',
      },
      {
        backgroundColor: '#d1eeeb',
        image: 'https://via.placeholder.com/155',
        text: 'Asdf Lpopop',
        title: 'Androgynous Android',
      },
      {
        backgroundColor: '#ffe0e5',
        image: 'https://via.placeholder.com/155',
        text: 'Misunderstood',
        title: 'Topical Carebear',
      },
      {
        backgroundColor: '#d3e8ff',
        image: 'https://via.placeholder.com/155',
        text: 'Candlestick Tomato',
        title: 'Native Dreamer',
      },
      {
        backgroundColor: '#c5eefa',
        image: 'https://via.placeholder.com/155',
        text: 'Could Be',
        title: 'Past Tense',
      },
    ],
  },
]

const getItemTemplate = (itemData: any, type: string): any => {
  switch (type) {
    case 'cryptokitties':
      return <Cryptokitty data={itemData} />
    default:
      return null
  }
}

const Collectibles = ({ classes }: Props) => (
  <Card>
    <div className={classes.cardInner}>
      {data.map((item, index) => (
        <>
          <div className={classes.title}>
            <div className={classes.titleImg} style={{ backgroundImage: `url(${CryptoKittiesAvatar})` }} />
            <h2 className={classes.titleText}>{item.title}</h2>
          </div>
          <div key={index} className={classes.gridRow}>
            {item.data.map((item2, index2) => (
              <div key={index2} className={classes.item}>{getItemTemplate(item2, item.type)}</div>
            ))}
          </div>
        </>
      ))}
    </div>
    <TablePagination
      component="div"
      count={11}
      onChangePage={() => {}}
      onChangeRowsPerPage={() => {}}
      page={1}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
    />
  </Card>
)

export default withStyles(styles)(Collectibles)
