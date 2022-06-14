import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { getSortedNotifications } from '../Notifications'

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

describe('getSortedNotifications', () => {
  it("should't sort correctly ordered notifications", () => {
    const notifications = [UNREAD_ACTION_NOTIFICATION, UNREAD_NOTIFICATION, READ_ACTION_NOTIFICATION, READ_NOTIFICATION]

    expect(getSortedNotifications(notifications)).toEqual(notifications)
  })

  it('should sort the notifications chronologically', () => {
    const notifications = [{ timestamp: 1 }, { timestamp: 2 }, { timestamp: 3 }, { timestamp: 4 }] as NotificationsState

    const sortedNotifications = [{ timestamp: 4 }, { timestamp: 3 }, { timestamp: 2 }, { timestamp: 1 }]

    expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
  })

  it('should sort unread actionable notifications to the top', () => {
    const notifications = [READ_ACTION_NOTIFICATION, READ_NOTIFICATION, UNREAD_ACTION_NOTIFICATION]

    const sortedNotifications = [UNREAD_ACTION_NOTIFICATION, READ_ACTION_NOTIFICATION, READ_NOTIFICATION]

    expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
  })

  it('should sort unread notifications to the top', () => {
    const notifications = [READ_ACTION_NOTIFICATION, READ_NOTIFICATION, UNREAD_NOTIFICATION]

    const sortedNotifications = [UNREAD_NOTIFICATION, READ_ACTION_NOTIFICATION, READ_NOTIFICATION]

    expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
  })

  it('should sort actionable notifications to the top, followed by unread notifications', () => {
    const notifications = [READ_ACTION_NOTIFICATION, READ_NOTIFICATION, UNREAD_NOTIFICATION, UNREAD_ACTION_NOTIFICATION]

    const sortedNotifications = [
      UNREAD_ACTION_NOTIFICATION,
      UNREAD_NOTIFICATION,
      READ_ACTION_NOTIFICATION,
      READ_NOTIFICATION,
    ]

    expect(getSortedNotifications(notifications)).toEqual(sortedNotifications)
  })
})
