import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

const useAppsSearch = (apps: SafeApp[], searchText: string): SafeApp[] => {
  const fuse = useMemo(
    () =>
      new Fuse(apps, {
        keys: ['name', 'description'],
        threshold: 0.3,
        findAllMatches: true,
      }),
    [apps],
  )

  const results = useMemo(
    () => (searchText ? fuse.search(searchText).map((result) => result.item) : apps),
    [fuse, apps, searchText],
  )

  return results
}

export { useAppsSearch }
