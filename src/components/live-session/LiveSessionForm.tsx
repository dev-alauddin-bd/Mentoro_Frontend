"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Sparkles } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useGenerateLiveSessionMutation } from "@/redux/features/ai/aiApi"
import { SessionFormValues } from "@/interfaces/liveSession.interfce"
// =================== Session Form Values ===================



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
  const [generateLiveSession, { isLoading: isGenerating }] =
    useGenerateLiveSessionMutation()

  const [thumbPreview, setThumbPreview] = useState<string | null>(
    initialData?.thumbnail || null
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionFormValues>()




  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  setValue("thumbnailFile", file);
  const reader = new FileReader();
  reader.onload = () => setThumbPreview(reader.result as string);
  reader.readAsDataURL(file);
};


const handleSaveDraft = () => {
  const draftData: SessionFormValues = {
    title: watch("title"),
    description: watch("description"),
    sessionDate: watch("sessionDate"),
    sessionTime: watch("sessionTime"),
    registrationDeadlineDate: watch("registrationDeadlineDate"),
    registrationDeadlineTime: watch("registrationDeadlineTime"),
    maxCapacity: watch("maxCapacity"),
    meetingLink: watch("meetingLink"),
    isPublished: watch("isPublished"),
    level: watch("level"),
    learningOutcomes: watch("learningOutcomes"),
    whoShouldAttend: watch("whoShouldAttend"),
    keyTopics: watch("keyTopics"),
  };
  localStorage.setItem("liveSessionDraft", JSON.stringify(draftData));
  toast.success("Draft saved successfully!");
};


return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  const res = await generateLiveSession({
                    title: `${currentTitle} ${currentDesc}`,
                  }).unwrap()
                  console.log(res)
                  if (res?.data?.data?.title) {
                    setValue("title", res?.data?.data?.title, {
                      shouldValidate: true,
                    })
                  }

                  if (res?.data?.data?.fullDescription) {
                    setValue(
                      "description",
                      res?.data?.data?.fullDescription,
                      {
                        shouldValidate: true,
                      }
                    )
                  }

                  // Set new fields from AI response if present
                  if (res?.data?.data?.level) {
                    setValue("level", res.data.level, { shouldValidate: true })
                    console.log('AI level:', res.data.level)
                  }
                  if (res?.data?.data?.learningOutcomes) {
                    setValue("learningOutcomes", res?.data?.data?.learningOutcomes, { shouldValidate: true })
                    console.log('AI learningOutcomes:', res?.data?.data?.learningOutcomes)
                  }
                  if (res?.data?.data?.whoShouldAttend) {
                    setValue("whoShouldAttend", res?.data?.data?.whoShouldAttend, { shouldValidate: true })
                    console.log('AI whoShouldAttend:', res?.data?.data?.whoShouldAttend)
                  }
                  if (res?.data?.data?.keyTopics) {
                    setValue("keyTopics", res?.data?.data?.keyTopics, { shouldValidate: true })
                    console.log('AI keyTopics:', res?.data?.data?.keyTopics)
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

        {/* LEVEL */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.level")}
          </label>
          <select {...register("level")} className="h-12 rounded-xl w-full">
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          {errors.level && (
            <p className="text-xs text-destructive font-medium">
              {errors.level.message}
            </p>
          )}
        </div>

        {/* LEARNING OUTCOMES */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.learning_outcomes")}
          </label>
          <Textarea
            {...register("learningOutcomes")}
            placeholder={t("live_sessions.form.learning_outcomes_placeholder")}
            className="min-h-[100px] rounded-xl"
          />
          {errors.learningOutcomes && (
            <p className="text-xs text-destructive font-medium">
              {errors.learningOutcomes.message}
            </p>
          )}
        </div>

        {/* WHO SHOULD ATTEND */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.who_should_attend")}
          </label>
          <Textarea
            {...register("whoShouldAttend")}
            placeholder={t("live_sessions.form.who_should_attend_placeholder")}
            className="min-h-[100px] rounded-xl"
          />
          {errors.whoShouldAttend && (
            <p className="text-xs text-destructive font-medium">
              {errors.whoShouldAttend.message}
            </p>
          )}
        </div>

        {/* KEY TOPICS */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {t("live_sessions.form.key_topics")}
          </label>
          <Textarea
            {...register("keyTopics")}
            placeholder={t("live_sessions.form.key_topics_placeholder")}
            className="min-h-[100px] rounded-xl"
          />
          {errors.keyTopics && (
            <p className="text-xs text-destructive font-medium">
              {errors.keyTopics.message}
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
