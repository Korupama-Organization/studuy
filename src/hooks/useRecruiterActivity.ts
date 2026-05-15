import { useCallback, useEffect, useMemo, useState } from "react";
import {
  dashboardService,
  type Notification,
  type UpcomingInterview,
} from "../services/dashboardService";

const READ_NOTIFICATIONS_STORAGE_KEY = "recruiterReadNotificationIds";
const MAX_STORED_READ_NOTIFICATION_IDS = 300;

const readStoredNotificationIds = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(READ_NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const writeStoredNotificationIds = (ids: string[]) => {
  if (typeof window === "undefined") return;

  const trimmedIds = ids.slice(-MAX_STORED_READ_NOTIFICATION_IDS);
  window.localStorage.setItem(
    READ_NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(trimmedIds),
  );
};

export const useNotificationReadState = (notifications: Notification[]) => {
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(
    readStoredNotificationIds,
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === READ_NOTIFICATIONS_STORAGE_KEY) {
        setReadNotificationIds(readStoredNotificationIds());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const readIdSet = useMemo(
    () => new Set(readNotificationIds),
    [readNotificationIds],
  );

  const unreadNotificationCount = useMemo(
    () =>
      notifications.filter((notification) => !readIdSet.has(notification.id))
        .length,
    [notifications, readIdSet],
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setReadNotificationIds((currentIds) => {
      const nextIds = new Set(currentIds);
      notifications.forEach((notification) => {
        nextIds.add(notification.id);
      });

      const nextIdList = Array.from(nextIds);
      writeStoredNotificationIds(nextIdList);
      return nextIdList;
    });
  }, [notifications]);

  return {
    unreadNotificationCount,
    hasUnreadNotifications: unreadNotificationCount > 0,
    markAllNotificationsAsRead,
  };
};

export const useRecruiterActivity = (defaultOpen = false) => {
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(defaultOpen);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>(
    [],
  );
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadActivity = async () => {
      await Promise.resolve();
      if (!isActive) return;

      setIsActivityLoading(true);
      setActivityError("");

      try {
        const data = await dashboardService.getDashboard("week");
        if (!isActive) return;

        setNotifications(data.notifications ?? []);
        setUpcomingInterviews(data.upcomingInterviews ?? []);
      } catch (error) {
        if (!isActive) return;

        setActivityError(
          error instanceof Error
            ? error.message
            : "Không thể tải bảng thông báo.",
        );
      } finally {
        if (isActive) {
          setIsActivityLoading(false);
        }
      }
    };

    void loadActivity();

    return () => {
      isActive = false;
    };
  }, []);

  const toggleActivityPanel = useCallback(() => {
    setIsActivityPanelOpen((current) => !current);
  }, []);

  const closeActivityPanel = useCallback(() => {
    setIsActivityPanelOpen(false);
  }, []);

  const notificationReadState = useNotificationReadState(notifications);

  return {
    isActivityPanelOpen,
    toggleActivityPanel,
    closeActivityPanel,
    notifications,
    upcomingInterviews,
    isActivityLoading,
    activityError,
    notificationCount: notificationReadState.unreadNotificationCount,
    unreadNotificationCount: notificationReadState.unreadNotificationCount,
    hasUnreadNotifications: notificationReadState.hasUnreadNotifications,
    markAllNotificationsAsRead:
      notificationReadState.markAllNotificationsAsRead,
  };
};
