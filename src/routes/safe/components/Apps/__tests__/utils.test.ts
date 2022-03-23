import { getAppIcon, isAppManifestValid } from '../utils'

describe('SafeApp manifest', () => {
  it('It should return true given a manifest with mandatory values supplied', () => {
    const manifest = {
      name: 'test',
      description: 'a test',
      error: false,
      iconPath: 'icon.png',
      icons: [
        {
          src: 'icon.png',
          sizes: '512x512',
        },
      ],
      providedBy: 'test',
    }

    const result = isAppManifestValid(manifest)
    expect(result).toBe(true)
  })

  it('It should return false given a manifest without name', () => {
    const manifest = {
      name: '',
      description: 'a test',
      error: false,
    }

    // @ts-expect-error we're testing handling invalid data
    const result = isAppManifestValid(manifest)
    expect(result).toBe(false)
  })

  it('It should return false given a manifest without description', () => {
    const manifest = {
      name: 'test',
      description: '',
      error: false,
    }

    // @ts-expect-error we're testing handling invalid data
    const result = isAppManifestValid(manifest)
    expect(result).toBe(false)
  })

  it('It should return the best icon given an icons array', () => {
    const icons = [
      {
        src: 'one.png',
        sizes: '48x48',
        type: 'image/webp',
      },
      {
        src: 'two.png',
        sizes: '48x48',
      },
      {
        src: 'three.png',
        sizes: '72x72 96x96 128x128',
      },
      {
        src: 'four.png',
        sizes: '72x72 96x96 256x256',
      },
      {
        src: 'five.svg',
        sizes: 'any',
      },
    ]

    expect(getAppIcon(icons)).toBe('five.svg')
    icons.splice(icons.length - 1, 1)
    expect(getAppIcon(icons)).toBe('three.png')
    icons.splice(icons.length - 2, 1)
    expect(getAppIcon(icons)).toBe('four.png')
    icons.splice(icons.length - 1, 1)
    expect(getAppIcon(icons)).toBe('one.png')
  })
})
