import { isAppManifestValid } from '../utils'

describe('SafeApp manifest', () => {
  it('It should return true given a manifest with mandatory values supplied', async () => {
    const manifest = {
      name: 'test',
      description: 'a test',
      error: false,
      iconPath: 'icon.png',
      providedBy: 'test',
    }

    const result = isAppManifestValid(manifest)
    expect(result).toBe(true)
  })

  it('It should return false given a manifest without name', async () => {
    const manifest = {
      name: '',
      description: 'a test',
      error: false,
    }

    // @ts-expect-error we're testing handling invalid data
    const result = isAppManifestValid(manifest)
    expect(result).toBe(false)
  })

  it('It should return false given a manifest without description', async () => {
    const manifest = {
      name: 'test',
      description: '',
      error: false,
    }

    // @ts-expect-error we're testing handling invalid data
    const result = isAppManifestValid(manifest)
    expect(result).toBe(false)
  })
})
