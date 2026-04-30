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

  const handleSubmit = async (data: any) => {
    try {
      // Ensure date fields are properly formatted as full ISO-8601 DateTime strings for Prisma
      const payload = {
        ...data,
        sessionDate: new Date(data.sessionDate).toISOString(),
        registrationDeadline: new Date(data.registrationDeadline).toISOString(),
      }

      if (session) {
        await updateSession({ id: session.id, ...payload }).unwrap()
        toast.success(t("live_sessions.modal.success_update"))
      } else {
        await createSession(payload).unwrap()
        toast.success(t("live_sessions.modal.success_create"))
      }
      onSuccess?.()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || t("live_sessions.modal.error_create"))
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
            isLoading={isCreating || isUpdating} 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
