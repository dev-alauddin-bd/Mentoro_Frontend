"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { LiveSessionForm } from "./LiveSessionForm"
import { 
  useCreateSessionMutation, 
  useUpdateSessionMutation 
} from "@/redux/features/liveSession/liveSessionApi"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useState } from "react"

interface LiveSessionModalProps {
  isOpen: boolean
  onClose: () => void
  session?: any // If provided, we are in update mode
  onSuccess?: () => void
}

export function LiveSessionModal({ isOpen, onClose, session, onSuccess }: LiveSessionModalProps) {
  const { t } = useTranslation()
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation()
  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation()
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      setIsUploading(true)

      // Combine date and time fields into ISO strings for Prisma
      const sessionDateISO = new Date(`${data.sessionDate}T${data.sessionTime}`).toISOString()
      const registrationDeadlineISO = new Date(`${data.registrationDeadlineDate}T${data.registrationDeadlineTime}`).toISOString()

      // Build FormData payload
      const formData = new FormData()
      // Append scalar fields
      formData.append("title", data.title)
      formData.append("description", data.description || "")
      formData.append("sessionDate", sessionDateISO)
      formData.append("registrationDeadline", registrationDeadlineISO)
      if (data.maxCapacity) formData.append("maxCapacity", String(data.maxCapacity))
      if (data.meetingLink) formData.append("meetingLink", data.meetingLink)
      formData.append("isPublished", String(data.isPublished))
      formData.append("level", data.level)
      // Append array fields as JSON strings
      if (data.learningOutcomes?.length) formData.append("learningOutcomes", JSON.stringify(data.learningOutcomes))
      if (data.whoShouldAttend?.length) formData.append("whoShouldAttend", JSON.stringify(data.whoShouldAttend))
      if (data.keyTopics?.length) formData.append("keyTopics", JSON.stringify(data.keyTopics))
      // Append thumbnail file if present
      if (data.thumbnailFile) {
        formData.append("thumbnail", data.thumbnailFile)
      }

      if (session) {
        await updateSession({ id: session.id, body: formData }).unwrap()
        toast.success(t("live_sessions.modal.success_update"))
      } else {
        await createSession(formData).unwrap()
        if (typeof window !== "undefined") {
          localStorage.removeItem("liveSessionDraft")
        }
        toast.success(t("live_sessions.modal.success_create"))
      }
      onSuccess?.()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || t("live_sessions.modal.error_create"))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {session ? t("live_sessions.modal.update_title") : t("live_sessions.modal.create_title")}
            </DialogTitle>
            <DialogDescription className="font-medium">
              {session 
                ? t("live_sessions.modal.update_desc")
                : t("live_sessions.modal.create_desc")}
            </DialogDescription>
          </DialogHeader>

          <LiveSessionForm 
            initialData={session} 
            onSubmit={handleSubmit} 
            isLoading={isCreating || isUpdating || isUploading} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
