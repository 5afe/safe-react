import { getRandomName, useMnemonicName, useMnemonicSafeName } from '../useMnemonicName'

jest.mock('react', () => ({
  useRef: () => ({ current: '' }),
}))

describe('useMnemonicName tests', () => {
  it('should generate a random name', () => {
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
  })

  it('should work as a hook', () => {
    expect(useMnemonicName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(useMnemonicName('test')).toMatch(/^[a-z-]+-test$/)
  })

  it('should return a random safe name', () => {
    expect(useMnemonicSafeName()).toMatch(/^[a-z-]+-safe$/)
  })
})
