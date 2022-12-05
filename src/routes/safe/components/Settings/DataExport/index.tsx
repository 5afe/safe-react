import { ReactElement } from 'react'
import { Link } from '@material-ui/core'
import Button from 'src/components/layout/Button'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'

const EXPORT_VERSION = '1.0'

const DataExport = (): ReactElement => {
  const handleExport = () => {
    const filename = `safe-data-${new Date().toISOString().slice(0, 10)}.json`

    const data = JSON.stringify({ version: EXPORT_VERSION, data: localStorage })

    const blob = new Blob([data], { type: 'text/json' })
    const link = document.createElement('a')

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')
    link.dispatchEvent(new MouseEvent('click'))
  }

  return (
    <>
      <Heading tag="h2">Export your data</Heading>
      <Paragraph>
        Download your local data with your added Safes and address book. You can import it on{' '}
        <Link target="_blank" href="https://app.safe.global/import" color="secondary">
          app.safe.global/import
        </Link>
        .
      </Paragraph>
      <Button onClick={handleExport} color="primary" size="small" variant="contained">
        Download
      </Button>
    </>
  )
}

export default DataExport
