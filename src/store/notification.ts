import create from 'zustand'

type NotificationData = {
  title: string,
  message: string,
  success: boolean,
  show: boolean
}

interface NotificationState extends NotificationData {
  showNotification: (notificationData: NotificationData) => void
  closeNotification: () => void
}

const useNotificationStore = create<NotificationState>()(
  (set) => ({
    title: '',
    message: '',
    success: false,
    show: false,
    showNotification: (notificationData) => set(() => ({ title: notificationData.title, message: notificationData.message, success: notificationData.success, show: notificationData.show})),
    closeNotification: () => set(() => ({ show: false }))
  })
);

export default useNotificationStore;