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
import toast from "react-hot-toast"

interface LiveSessionModalProps {
  isOpen: boolean
  onClose: () => void
  session?: any // If provided, we are in update mode
  onSuccess?: () => void
}

export function LiveSessionModal({ isOpen, onClose, session, onSuccess }: LiveSessionModalProps) {
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation()
  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation()

  const handleSubmit = async (data: any) => {
    try {
      if (session) {
        await updateSession({ id: session.id, ...data }).unwrap()
        toast.success("Session updated successfully")
      } else {
        await createSession(data).unwrap()
        toast.success("Session created successfully")
      }
      onSuccess?.()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {session ? "Update Live Session" : "Create New Live Session"}
            </DialogTitle>
            <DialogDescription className="font-medium">
              {session 
                ? "Update the details of your upcoming live session." 
                : "Fill in the information below to schedule a new live event."}
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
