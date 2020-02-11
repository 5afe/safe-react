// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import Card from '@material-ui/core/Card'
import {
  screenSm, fontColor,
} from '~/theme/variables'
import Item from './components/Item'
import CryptoKittiesAvatar from './img/cryptokitties.png'
import MarbleCardsAvatar from './img/marblecards.png'

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
    marginBottom: '45px',
    maxWidth: '100%',
    rowGap: '45px',

    '&:last-child': {
      marginBottom: '0',
    },

    [`@media (min-width: ${screenSm}px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
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
  titleFiller: {
    backgroundColor: '#e8e7e6',
    flexGrow: '1',
    height: '2px',
    marginLeft: '40px',
  },
})

type Props = {
  classes: Object,
}

const data = [
  {
    image: CryptoKittiesAvatar,
    title: 'CryptoKitties',
    data: [
      {
        image: 'https://via.placeholder.com/155',
        text: 'Serpent Gen 123456',
        title: 'Mystical Potato',
      },
      {
        image: 'https://via.placeholder.com/50',
        text: 'Asdf Lpopop',
        title: 'Androgynous Android',
      },
      {
        image: 'https://via.placeholder.com/500',
        text: 'Misunderstood',
        title: 'Topical Carebear',
      },
      {
        image: 'https://via.placeholder.com/1024x768',
        text: 'Candlestick Tomato',
        title: 'Native Dreamer',
      },
      {
        image: 'https://via.placeholder.com/768x1280',
        text: 'Could Be',
        title: 'Past Tense',
      },
    ],
  },
  {
    image: MarbleCardsAvatar,
    title: 'MarbleCards',
    data: [
      {
        image: 'https://via.placeholder.com/800x600',
      },
      {
        image: 'https://via.placeholder.com/1280x720',
      },
      {
        image: 'https://via.placeholder.com/500x200',
      },
    ],
  },
]

const Collectibles = ({ classes }: Props) => (
  <Card>
    <div className={classes.cardInner}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div className={classes.title}>
            <div className={classes.titleImg} style={{ backgroundImage: `url(${item.image})` }} />
            <h2 className={classes.titleText}>{item.title}</h2>
            <div className={classes.titleFiller} />
          </div>
          <div key={index} className={classes.gridRow}>
            {item.data.map((item2, index2) => (
              <Item key={index2} data={item2} />
            ))}
          </div>
        </React.Fragment>
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
