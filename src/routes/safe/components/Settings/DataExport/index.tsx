import { ReactElement } from 'react'
import Button from 'src/components/layout/Button'

const DataExport = (): ReactElement => {
  const handleExport = () => {
    const filename = `safe-data-${new Date().toISOString().slice(0, 10)}.json`

    const data = JSON.stringify(localStorage)

    const blob = new Blob([data], { type: 'text/json' })
    const link = document.createElement('a')

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
    link.dispatchEvent(new MouseEvent('click'))
  }

  return (
    <Button onClick={handleExport} color="primary" size="small" variant="outlined">
      Download
    </Button>
  )
}

export default DataExport
