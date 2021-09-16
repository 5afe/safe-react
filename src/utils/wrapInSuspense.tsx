import { Suspense, SuspenseProps } from 'react'

export const wrapInSuspense = (
  component: Required<SuspenseProps['children']>,
  fallback: SuspenseProps['fallback'] = null,
) => <Suspense fallback={fallback}>{component}</Suspense>
