import { secondary } from 'src/theme/variables'

export const styles = () => ({
  tabWrapper: {
    display: 'flex',
    flexDirection: 'row',
    '& svg': {
      display: 'block',
      marginRight: '5px',
    },
    '& .fill': {
      fill: 'rgba(0, 0, 0, 0.54)',
    },
  },
  tabWrapperSelected: {
    '& .fill': {
      fill: secondary,
    },
  },
})
