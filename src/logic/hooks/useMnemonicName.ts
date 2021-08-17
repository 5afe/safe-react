import { useRef } from 'react'
import { animalsDict, adjectivesDict } from './useMnemonicName.dict'

const animals: string[] = animalsDict.trim().split(/\s+/)
const adjectives: string[] = adjectivesDict.trim().split(/\s+/)

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(arr.length * Math.random())]
}

export const getRandomName = () => {
  const adj = getRandomItem<string>(adjectives)
  const noun = getRandomItem<string>(animals)
  return `${adj}-${noun}`
}

export const useMnemonicName = () => {
  const name = useRef<string>('')

  if (!name.current) {
    name.current = getRandomName()
  }

  return name.current
}

export const useMnemonicSafeName = () => {
  const name = useMnemonicName()
  return `${name}-safe`
}
