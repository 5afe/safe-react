import { getRandomName } from '../useMnemonicName'

describe('useMnemonicName tests', () => {
  it('should generate a random name', () => {
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
    expect(getRandomName()).toMatch(/^[a-z-]+-[a-z]+$/)
  })
})
