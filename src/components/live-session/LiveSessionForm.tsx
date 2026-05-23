"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  useGenerateContentMutation,

} from "@/redux/features/ai/aiApi"

export interface SessionFormValues {
  title: string
  description: string
  thumbnail?: string
  thumbnailFile?: File
  sessionDate: string
  sessionTime: string
  registrationDeadlineDate: string
  registrationDeadlineTime: string
  maxCapacity?: number
  meetingLink?: string
  isPublished: boolean
}

interface LiveSessionFormProps {
  initialData?: any
  onSubmit: SubmitHandler<SessionFormValues>
  isLoading?: boolean
}

export function LiveSessionForm({
  initialData,
  onSubmit,
  isLoading,
}: LiveSessionFormProps) {
  const { t } = useTranslation()

  // ✅ FIXED: initialize RTK Query mutations
  const [generateContent, { isLoading: isGenerating }] =
    useGenerateContentMutation()

  const [thumbPreview, setThumbPreview] = useState<string | null>(
    initialData?.thumbnail || null
  )

  const sessionSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(3, t("live_sessions.validation.title_min")),
        description: z
          .string()
          .min(10, t("live_sessions.validation.desc_min")),
        thumbnail: z.string().optional(),
        thumbnailFile: z.any().optional(),

        sessionDate: z
          .string()
          .min(1, t("live_sessions.validation.date_required")),

        sessionTime: z.string().min(1, "Time is required"),

        registrationDeadlineDate: z
          .string()
          .min(1, t("live_sessions.validation.deadline_required")),

        registrationDeadlineTime: z.string().min(1, "Time is required"),

        maxCapacity: z.preprocess(
          (val) =>
            val === "" ||
            val === null ||
            val === undefined ||
            (typeof val === "number" && isNaN(val))
              ? undefined
              : Number(val),
          z
            .number()
            .min(1, t("live_sessions.validation.capacity_min"))
            .optional()
        ),

        meetingLink: z.preprocess(
          (val) => (val === "" ? undefined : val),
          z
            .string()
            .url(t("live_sessions.validation.url_invalid"))
            .optional()
        ),

        isPublished: z.boolean(),
      }),
    [t]
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema as any),

    defaultValues: useMemo(() => {
      if (initialData) {
        return {
          title: initialData.title || "",
          description: initialData.description || "",
          thumbnail: initialData.thumbnail || "",

          sessionDate: initialData.sessionDate
            ? new Date(initialData.sessionDate)
                .toISOString()
                .slice(0, 10)
            : "",

          sessionTime: initialData.sessionDate
            ? new Date(initialData.sessionDate)
                .toISOString()
                .slice(11, 16)
            : "",

          registrationDeadlineDate: initialData.registrationDeadline
            ? new Date(initialData.registrationDeadline)
                .toISOString()
                .slice(0, 10)
            : "",

          registrationDeadlineTime: initialData.registrationDeadline
            ? new Date(initialData.registrationDeadline)
                .toISOString()
                .slice(11, 16)
            : "",

          maxCapacity: initialData.maxCapacity || undefined,
          meetingLink: initialData.meetingLink || "",
          isPublished: initialData.isPublished || false,
        }
      }

      if (typeof window !== "undefined") {
        const draft = localStorage.getItem("liveSessionDraft")

        if (draft) {
          try {
            return JSON.parse(draft)
          } catch (e) {}
        }
      }

      return {
        title: "",
        description: "",
        thumbnail: "",
        sessionDate: "",
        sessionTime: "",
        registrationDeadlineDate: "",
        registrationDeadlineTime: "",
        maxCapacity: undefined,
        meetingLink: "",
        isPublished: false,
      }
    }, [initialData]),
  })

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        thumbnail: initialData.thumbnail || "",

        sessionDate: initialData.sessionDate
          ? new Date(initialData.sessionDate)
              .toISOString()
              .slice(0, 10)
          : "",

        sessionTime: initialData.sessionDate
          ? new Date(initialData.sessionDate)
              .toISOString()
              .slice(11, 16)
          : "",

        registrationDeadlineDate: initialData.registrationDeadline
          ? new Date(initialData.registrationDeadline)
              .toISOString()
              .slice(0, 10)
          : "",

        registrationDeadlineTime: initialData.registrationDeadline
          ? new Date(initialData.registrationDeadline)
              .toISOString()
              .slice(11, 16)
          : "",

        maxCapacity: initialData.maxCapacity || undefined,
        meetingLink: initialData.meetingLink || "",
        isPublished: initialData.isPublished || false,
      })

      setThumbPreview(initialData.thumbnail || null)
    }
  }, [initialData, reset])

  useEffect(() => {
    if (initialData) return

    const subscription = watch((value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "liveSessionDraft",
          JSON.stringify(value)
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, initialData])

  const handleThumbChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setValue("thumbnailFile", file)

    const reader = new FileReader()

    reader.onload = () =>
      setThumbPreview(reader.result as string)

    reader.readAsDataURL(file)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-4">
        {/* TITLE */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold">
              {t("live_sessions.form.title")}
            </label>

            <button
              type="button"
              onClick={async () => {
                const currentTitle = watch("title")
                const currentDesc = watch("description")

                if (!currentTitle && !currentDesc) {
                  toast.error(
                    "Please enter a few words in the title or description first."
                  )
                  return
                }

                try {
                  const res = await generateContent({
                    topic: `${currentTitle} ${currentDesc}`,
                  }).unwrap()

                  if (res?.data?.title) {
                    setValue("title", res.data.title, {
                      shouldValidate: true,
                    })
                  }

                  if (res?.data?.description) {
                    setValue(
                      "description",
                      res.data.description,
                      {
                        shouldValidate: true,
                      }
                    )
                  }

                  toast.success("AI Content Generated!")
                } catch (e) {
                  toast.error("Failed to generate content.")
                }
              }}
              disabled={isGenerating}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles
                size={14}
                className={
                  isGenerating ? "animate-pulse" : ""
                }
              />

              {isGenerating
                ? "Generating..."
                : "Auto-Generate with AI"}
            </button>
          </div>

          <Input
            {...register("title")}
            placeholder={t(
              "live_sessions.form.title_placeholder"
            )}
            className="h-12 rounded-xl"
          />

          {errors.title && (
            <p className="text-xs text-destructive font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.description")}
          </label>

          <Textarea
            {...register("description")}
            placeholder={t(
              "live_sessions.form.description_placeholder"
            )}
            className="min-h-[120px] rounded-xl"
          />

          {errors.description && (
            <p className="text-xs text-destructive font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* DATE/TIME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">
              {t("live_sessions.form.date")}
            </label>

            <div className="flex gap-2">
              <Input
                {...register("sessionDate")}
                type="date"
                className="h-12 rounded-xl flex-1"
              />

              <Input
                {...register("sessionTime")}
                type="time"
                className="h-12 rounded-xl flex-[0.7]"
              />
            </div>

            {(errors.sessionDate || errors.sessionTime) && (
              <p className="text-xs text-destructive font-medium">
                {errors.sessionDate?.message ||
                  errors.sessionTime?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">
              {t("live_sessions.form.deadline")}
            </label>

            <div className="flex gap-2">
              <Input
                {...register("registrationDeadlineDate")}
                type="date"
                className="h-12 rounded-xl flex-1"
              />

              <Input
                {...register("registrationDeadlineTime")}
                type="time"
                className="h-12 rounded-xl flex-[0.7]"
              />
            </div>

            {(errors.registrationDeadlineDate ||
              errors.registrationDeadlineTime) && (
              <p className="text-xs text-destructive font-medium">
                {errors.registrationDeadlineDate?.message ||
                  errors.registrationDeadlineTime?.message}
              </p>
            )}
          </div>
        </div>

        {/* THUMBNAIL + CAPACITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">
              {t("live_sessions.form.thumbnail")}
            </label>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="h-12 rounded-xl cursor-pointer"
                />
              </div>

              {thumbPreview && (
                <div className="w-16 h-12 rounded-lg overflow-hidden border">
                  <img
                    src={thumbPreview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">
              {t("live_sessions.form.capacity")}
            </label>

            <Input
              {...register("maxCapacity", {
                valueAsNumber: true,
              })}
              type="number"
              placeholder={t(
                "live_sessions.form.capacity_placeholder"
              )}
              className="h-12 rounded-xl"
            />

            {errors.maxCapacity && (
              <p className="text-xs text-destructive font-medium">
                {errors.maxCapacity.message}
              </p>
            )}
          </div>
        </div>

        {/* MEETING LINK */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.meeting_link")}
          </label>

          <Input
            {...register("meetingLink")}
            placeholder={t(
              "live_sessions.form.meeting_link_placeholder"
            )}
            className="h-12 rounded-xl"
          />

          {errors.meetingLink && (
            <p className="text-xs text-destructive font-medium">
              {errors.meetingLink.message}
            </p>
          )}
        </div>

        {/* PUBLISH */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isPublished"
            checked={watch("isPublished")}
            onCheckedChange={(checked) =>
              setValue("isPublished", !!checked)
            }
          />

          <label
            htmlFor="isPublished"
            className="text-sm font-bold cursor-pointer"
          >
            {t("live_sessions.form.publish")}
          </label>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-8 rounded-xl font-bold min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("live_sessions.form.saving")}
            </>
          ) : initialData ? (
            t("live_sessions.form.update")
          ) : (
            t("live_sessions.form.create")
          )}
        </Button>
      </div>
    </form>
  )
}