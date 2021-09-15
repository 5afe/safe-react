import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

const useAppsSearch = (apps: SafeApp[], searchText: string): SafeApp[] => {
  const fuse = useMemo(
    () =>
      new Fuse(apps, {
        keys: ['name', 'description'],
        // https://fusejs.io/api/options.html#threshold
        // Very naive explanation: threshold represents how accurate the search results should be. The default is 0.6
        // I tested it and found it to make the search results more accurate when the threshold is 0.2
        // 0 - 1, where 0 is the exact match and 1 matches anything
        threshold: 0.2,
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
