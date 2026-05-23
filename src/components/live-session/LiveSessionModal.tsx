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
      let thumbnailUrl = data.thumbnail || (session?.thumbnail || "")

      // Upload to Cloudinary if a new file is selected
      if (data.thumbnailFile) {
        const fd = new FormData()
        fd.append("file", data.thumbnailFile)
        fd.append("upload_preset", "course_thumbnails")

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dyfamn6rm/image/upload",
          {
            method: "POST",
            body: fd,
          }
        )

        const json = await res.json()
        if (json.secure_url) {
          thumbnailUrl = json.secure_url
        } else {
          toast.error(t("live_sessions.modal.error_upload"))
          setIsUploading(false)
          return
        }
      }

      // Ensure date fields are properly formatted as full ISO-8601 DateTime strings for Prisma
      const payload = {
        ...data,
        thumbnail: thumbnailUrl,
        sessionDate: new Date(`${data.sessionDate}T${data.sessionTime}`).toISOString(),
        registrationDeadline: new Date(`${data.registrationDeadlineDate}T${data.registrationDeadlineTime}`).toISOString(),
      }
      
      // Remove separate time/date fields from payload as they're not needed by the backend
      delete (payload as any).thumbnailFile
      delete (payload as any).sessionTime
      delete (payload as any).registrationDeadlineDate
      delete (payload as any).registrationDeadlineTime

      if (session) {
        await updateSession({ id: session.id, ...payload }).unwrap()
        toast.success(t("live_sessions.modal.success_update"))
      } else {
        await createSession(payload).unwrap()
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
