import { isAppManifestValid } from '../utils'
import { SafeApp } from '../types'

describe('SafeApp manifest', () => {
  it('It should return true given a manifest with mandatory values supplied', async () => {
    const manifest = {
      name: 'test',
      description: 'a test',
      error: false,
    }

    const result = isAppManifestValid(manifest as SafeApp)
    expect(result).toBe(true)
  })

  it('It should return false given a manifest without name', async () => {
    const manifest = {
      name: '',
      description: 'a test',
      error: false,
    }

    const result = isAppManifestValid(manifest as SafeApp)
    expect(result).toBe(false)
  })

  it('It should return false given a manifest without description', async () => {
    const manifest = {
      name: 'test',
      description: '',
      error: false,
    }

    const result = isAppManifestValid(manifest as SafeApp)
    expect(result).toBe(false)
  })

  it('It should return false given a manifest with error', async () => {
    const manifest = {
      name: 'test',
      description: 'a test',
      error: true,
    }

    const result = isAppManifestValid(manifest as SafeApp)
    expect(result).toBe(false)
  })
})
