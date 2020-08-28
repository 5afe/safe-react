export const styles = () => ({
  container: {
    marginTop: '56px',
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
  },
  expandedRow: {
    backgroundColor: '#fff3e2',
  },
  cancelledRow: {
    opacity: 0.4,
  },
  extendedTxContainer: {
    padding: 0,
    border: 0,
    '&:last-child': {
      padding: 0,
    },
    backgroundColor: '#fffaf4',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  expandCellStyle: {
    paddingLeft: 0,
    paddingRight: 15,
  },
})
