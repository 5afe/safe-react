import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { getSortedNotifications } from '../'

const UNREAD_ACTION_NOTIFICATION = {
  read: false,
  action: true,
} as NotificationsState[number]

const UNREAD_NOTIFICATION = {
  read: false,
  action: false,
} as NotificationsState[number]

const READ_ACTION_NOTIFICATION = {
  read: true,
  action: true,
} as NotificationsState[number]

const READ_NOTIFICATION = {
  read: true,
  action: false,
} as NotificationsState[number]

describe('Notifications', () => {
  describe('getSortedNotifications', () => {
    it("should't sort correctly ordered notifications", () => {
      const notifications = [
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 6 },
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 5 },
        { ...UNREAD_NOTIFICATION, timestamp: 4 },
        { ...UNREAD_NOTIFICATION, timestamp: 3 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 2 },
        { ...READ_NOTIFICATION, timestamp: 1 },
      ]
      expect(getSortedNotifications(notifications)).toEqual(notifications)
    })

    it('should sort the read notifications chronologically regardless of action', () => {
      const notifications = [
        { ...READ_NOTIFICATION, timestamp: 1 },
        { ...READ_NOTIFICATION, timestamp: 2 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 4 },
      ]

      const sortedNotifications = [
        { ...READ_NOTIFICATION, timestamp: 4 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 2 },
        { ...READ_NOTIFICATION, timestamp: 1 },
      ]

      expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
    })

    it('should sort unread actionable notifications to the top', () => {
      const notifications = [
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 2 },
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 1 },
      ]

      const sortedNotifications = [
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 1 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 2 },
      ]
      expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
    })
    it('should sort unread notifications to the top', () => {
      const notifications = [
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 3 },
        { ...UNREAD_NOTIFICATION, timestamp: 1 },
      ]

      const sortedNotifications = [
        { ...UNREAD_NOTIFICATION, timestamp: 1 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 3 },
        { ...READ_NOTIFICATION, timestamp: 3 },
      ]

      expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
    })
    it('should sort actionable notifications to the top, followed by unread notifications', () => {
      const notifications = [
        { ...READ_ACTION_NOTIFICATION, timestamp: 4 },
        { ...READ_NOTIFICATION, timestamp: 3 },
        { ...UNREAD_NOTIFICATION, timestamp: 2 },
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 1 },
      ]

      const sortedNotifications = [
        { ...UNREAD_ACTION_NOTIFICATION, timestamp: 1 },
        { ...UNREAD_NOTIFICATION, timestamp: 2 },
        { ...READ_ACTION_NOTIFICATION, timestamp: 4 },
        { ...READ_NOTIFICATION, timestamp: 3 },
      ]

      expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
    })
  })
})
