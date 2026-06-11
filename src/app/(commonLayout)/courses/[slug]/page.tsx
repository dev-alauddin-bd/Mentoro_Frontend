"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
   useGetCourseBySlugQuery,
} from "@/redux/features/course/courseAPi";

import {
   ArrowLeft,
   BookOpen,
   CheckCircle,
   ChevronDown,
   Clock,
   Loader2,
   PlayCircle,
   Star,
   Users,
} from "lucide-react";

import toast from "react-hot-toast";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { IReview } from "@/interfaces/course.interface";
import { useCreateCheckoutMutation } from "@/redux/features/payment/paymentAPi";
import { useEnrollCourseMutation } from "@/redux/features/enroll/enrollApi";
import YouTubePreviewCard from "@/components/shared/youtube";
import RegistrationCard from "@/components/course-detail/RegistrationCard";

export default function CourseDetailsPage() {
   const params = useParams();
   const router = useRouter();

   const slug = params.slug as string;

   const { data, isLoading, refetch } = useGetCourseBySlugQuery(slug, {
      skip: !slug,
   });

   const course = data?.data;

   const [enrollCourse, { isLoading: isEnrolling }] =
      useEnrollCourseMutation();

   const [createCheckout] = useCreateCheckoutMutation();

   const [createReview] = useCreateReviewMutation();

   const [activeTab, setActiveTab] = useState<
      "details" | "curriculum" | "reviews"
   >("details");

   const [activeModule, setActiveModule] = useState<string | null>(null);

   const [rating, setRating] = useState(5);
   const [comment, setComment] = useState("");
   const [isSubmittingReview, setIsSubmittingReview] = useState(false);

   const [enrolled, setEnrolled] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
         </div>
      );
   }

   if (!course) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <h1>Course not found</h1>
         </div>
      );
   }

   // ================= BACKEND DATA =================
   const isEnrolled = course?.isEnrolled || enrolled;
   const isFree = course?.price === 0;


   // ================= ENROLL =================
   const handleEnrollment = async () => {

      try {

         const res = await enrollCourse({ slug: slug as string }).unwrap()
         console.log(res)

         if (res?.success) {
            const checkout = await createCheckout({
               courseId: res.data.courseId,
               enrollId: res.data.id,
            }).unwrap()

            console.log(checkout)

            if (checkout?.success && checkout?.data?.paymentUrl) {
               window.location.href = checkout.data.paymentUrl
            }
         }



      } catch (error: any) {
         toast.error(error?.data?.message || "Enrollment failed");
      }

   };

   // ================= REVIEW =================
   const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!comment.trim()) {
         toast.error("Please write something");
         return;
      }

      try {
         setIsSubmittingReview(true);

         await createReview({
            courseId: slug,
            rating,
            content: comment,
         }).unwrap();

         toast.success("Review submitted");

         setComment("");
         setRating(5);
         refetch();
      } catch (err: any) {
         toast.error(err?.data?.message || "Review failed");
      } finally {
         setIsSubmittingReview(false);
      }
   };

   const toggleModule = (id: string) => {
      setActiveModule((prev) => (prev === id ? null : id));
   };

   // ================= UI =================
   return (
       <div className="min-h-screen max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
      

         {/* HERO */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-3xl mb-12 mt-8">

  <div className="absolute inset-0 " />

  <div className="relative grid lg:grid-cols-12 gap-8 p-8 lg:p-12">

    <div className="lg:col-span-8 space-y-6">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
        Premium Course
      </span>

      <h1 className="text-4xl lg:text-6xl font-black leading-tight">
        {course.title}
      </h1>

      <p className="text-lg text-muted-foreground max-w-3xl">
        {course.description}
      </p>

      <div className="flex flex-wrap gap-6">

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>{course.enrollmentCount}+ Students</span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{course.modules?.length || 0} Modules</span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>{course.totalLessons || 0} Lessons</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>{course.totalDuration} mins</span>
        </div>

      </div>

      {course.hasCertificate && (
        <div className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Certificate Included
        </div>
      )}
    </div>

    <div className="lg:col-span-4">
      <div className="sticky top-24">
        <RegistrationCard
          title={course.title}
          previewVideo={course.previewVideo}
          thumb={course.thumbnail}
          price={course.price}
          isFree={isFree}
          isEnrolled={isEnrolled}
          isLoading={isEnrolling}
          onEnroll={handleEnrollment}
        />
      </div>
    </div>

  </div>
</div>

         {/* BODY */}
         <section className="px-4 py-12">

            <div className="grid lg:grid-cols-12 gap-10">

               {/* LEFT */}
               <div className="lg:col-span-8">

                  {/* TABS */}
                  <div className="flex gap-4 border-b pb-3 mb-6">

                     {["details", "curriculum", "reviews"].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab as any)}
                           className={`capitalize ${activeTab === tab ? "text-primary font-bold" : ""
                              }`}
                        >
                           {tab}
                        </button>
                     ))}

                  </div>

                  {/* DETAILS */}
                  {activeTab === "details" && (
                     <div className="space-y-4">

                        <h2 className="text-2xl font-bold">
                           What you’ll learn
                        </h2>

                        <ul className="space-y-2">
                           {(course.learningOutcomes || []).map(
                              (item: string, i: number) => (
                                 <li key={i} className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {item}
                                 </li>
                              )
                           )}
                        </ul>

                     </div>
                  )}

                  {/* CURRICULUM */}
                  {activeTab === "curriculum" && (
                     <div className="space-y-4">

                        {(course.modules || []).map((m: any, i: number) => (
                           <div key={m.id} className="border rounded-xl">

                              <button
                                 onClick={() => toggleModule(m.id)}
                                 className="w-full flex justify-between p-4"
                              >
                                 {i + 1}. {m.title}
                                 <ChevronDown className="w-4 h-4" />
                              </button>

                              {activeModule === m.id && (
                                 <div className="p-4 space-y-2">

                                    {(m.lessons || []).map((l: any) => (
                                       <div
                                          key={l.id}
                                          className="flex justify-between bg-gray-50 p-2 rounded"
                                       >
                                          <div className="flex gap-2">
                                             <PlayCircle className="w-4 h-4" />
                                             {l.title}
                                          </div>
                                          <span>{l.duration}m</span>
                                       </div>
                                    ))}

                                 </div>
                              )}

                           </div>
                        ))}

                     </div>
                  )}

                  {/* REVIEWS */}
                  {activeTab === "reviews" && (
                     <div className="space-y-6">

                        {isEnrolled && (
                           <form
                              onSubmit={handleReviewSubmit}
                              className="space-y-3 border p-4 rounded-xl"
                           >

                              <div className="flex gap-1">
                                 {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                       key={s}
                                       type="button"
                                       onClick={() => setRating(s)}
                                    >
                                       <Star
                                          className={
                                             s <= rating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : ""
                                          }
                                       />
                                    </button>
                                 ))}
                              </div>

                              <textarea
                                 value={comment}
                                 onChange={(e) => setComment(e.target.value)}
                                 className="w-full border p-2 rounded"
                                 placeholder="Write review..."
                              />

                              <button
                                 type="submit"
                                 className="bg-primary text-white px-4 py-2 rounded"
                                 disabled={isSubmittingReview}
                              >
                                 Submit
                              </button>

                           </form>
                        )}

                        {(course.reviews || []).length === 0 ? (
                           <p className="text-center text-muted-foreground">
                              No reviews yet
                           </p>
                        ) : (
                           course.reviews.map((r: IReview) => (
                              <div key={r.id} className="border p-4 rounded">

                                 <div className="font-bold">
                                    {r.user?.name}
                                 </div>

                                 <p className="text-sm text-muted-foreground">
                                    {r.content}
                                 </p>

                              </div>
                           ))
                        )}

                     </div>
                  )}

               </div>

        

            </div>

         </section>
      </div>
   );
}