/**
 * components/shared/NotificationsPopover.tsx
 *
 * Real-time Notifications Popover for Social Campaign Interactions.
 * Displays:
 * - Like notifications ("someone liked your campaign")
 * - Comment notifications ("someone commented on your campaign")
 * - Share notifications ("someone shared your campaign")
 * - Reply notifications ("someone replied to your comment")
 * With unread/read statuses, click-to-view navigation, and Mark All Read.
 */
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Heart,
  MessageSquare,
  Share2,
  CornerDownLeft,
  CheckCheck,
  Sparkles,
} from "lucide-react"
import { postsService } from "@/features/public/services/posts.service"
import type { NotificationItem } from "@/features/public/types/posts.types"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import toast from "react-hot-toast"

export function NotificationsPopover() {
  const { language } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const popoverRef = useRef<HTMLDivElement>(null)

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await postsService.getNotifications()
      setNotifications(res.notifications || [])
      setUnreadCount(res.unreadCount || 0)
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  // Periodic polling or initial fetch
  useEffect(() => {
    if (!isAuthenticated) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleMarkAllRead = async () => {
    try {
      await postsService.markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success(
        language === "ar"
          ? "تم تعيين جميع الإشعارات كمقروءة"
          : "All notifications marked as read"
      )
    } catch {
      // ignore
    }
  }

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await postsService.markNotificationRead(notif.id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch {
        // ignore
      }
    }
    setIsOpen(false)
    if (notif.campaignId) {
      navigate(`/posts/${notif.campaignId}`)
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "like":
        return <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
      case "comment":
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
      case "share":
        return <Share2 className="w-3.5 h-3.5 text-emerald-400" />
      case "reply":
        return <CornerDownLeft className="w-3.5 h-3.5 text-purple-400" />
      default:
        return <Bell className="w-3.5 h-3.5 text-primary" />
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        aria-label="Notifications"
        className="relative p-2.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-background animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card/95 border border-white/10 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-white font-heading">
                  {language === "ar" ? "الإشعارات" : "Notifications"}
                </h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                    {unreadCount} {language === "ar" ? "جديد" : "new"}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>
                    {language === "ar" ? "تحديد الكل كمقروء" : "Mark all read"}
                  </span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {isLoading && notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {language === "ar" ? "جارٍ التحميل..." : "Loading notifications..."}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-xs text-muted-foreground">
                    {language === "ar"
                      ? "لا توجد إشعارات جديدة حالياً"
                      : "No notifications right now"}
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      notif.isRead
                        ? "hover:bg-white/5 opacity-75"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    {/* Actor Avatar with Action Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={
                          notif.actor?.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                        }
                        alt={notif.actor?.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div className="absolute -bottom-1 -end-1 p-0.5 rounded-full bg-card ring-1 ring-white/10">
                        {getActionIcon(notif.actionType)}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white leading-snug">
                        <strong className="font-semibold text-primary">
                          {notif.actor?.name || (language === "ar" ? "مستخدم" : "A user")}
                        </strong>{" "}
                        <span className="text-slate-300">{notif.message}</span>
                      </p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {notif.createdAt}
                      </span>
                    </div>

                    {/* Unread Dot */}
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_8px_rgba(18,75,201,0.8)]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
