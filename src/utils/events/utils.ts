import { trackEvent } from 'src/utils/googleTagManager'

export type TrackEvent = Parameters<typeof trackEvent>[0]

export const addEventCategory = (
  events: Record<string, Omit<TrackEvent, 'category'>>,
  category: string,
): Record<string, TrackEvent> => {
  return Object.entries(events).reduce((events, [key, value]) => ({ ...events, [key]: { ...value, category } }), {})
}
