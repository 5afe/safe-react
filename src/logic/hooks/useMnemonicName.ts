import { useRef } from 'react'
import { animalsDict, adjectivesDict } from './useMnemonicName.dict'

const animals: string[] = animalsDict.trim().split(/\s+/)
const adjectives: string[] = adjectivesDict.trim().split(/\s+/)

const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(arr.length * Math.random())]
}

export const getRandomName = (noun = getRandomItem<string>(animals)): string => {
  const adj = getRandomItem<string>(adjectives)
  return `${adj}-${noun}`
}

export const useMnemonicName = (noun?: string): string => {
  const name = useRef<string>('')

  if (!name.current) {
    name.current = getRandomName(noun)
  }

  return name.current
}

export const useMnemonicSafeName = (): string => {
  return useMnemonicName('safe')
}
