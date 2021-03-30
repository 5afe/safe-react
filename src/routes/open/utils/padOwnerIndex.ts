export const padOwnerIndex = (index: number | string): string => {
  return index.toString().padStart(4, '0')
}
