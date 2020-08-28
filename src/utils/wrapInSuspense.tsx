import React from 'react'

export const wrapInSuspense = (component: any, fallback?: any) => (
  <React.Suspense fallback={fallback}>{component}</React.Suspense>
)
