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

            if(checkout?.success && checkout?.data?.paymentUrl){
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
      <div className="min-h-screen max-w-7xl mx-auto bg-background">

         {/* HERO */}
         <section className="border-b py-16">
            <div className="px-4">

               <button
                  onClick={() => router.push("/courses")}
                  className="flex items-center gap-2 text-sm mb-5"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>

               <div className="space-y-4">

                  <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                     {course.category?.name || "Course"}
                  </span>

                  <h1 className="text-4xl font-black">{course.title}</h1>

                  <p className="text-muted-foreground">
                     {course.description}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm">

                     <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 " />
                        {course.enrollmentCount} students
                     </div>

                     <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {course.modules?.length || 0} modules
                     </div>

                     <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {course.totalLessons || 0} lessons
                     </div>

                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {course?.totalDuration} mins
                     </div>

                     {/* // backend return hasCertificate: boolean; */}
                     {course.hasCertificate && (
                        <div className="flex items-center gap-2">
                           <CheckCircle className="w-4 h-4" />
                           Certificate available
                        </div>
                     )}


                  </div>

               </div>

            </div>
         </section>

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

               {/* RIGHT */}
               <div className="lg:col-span-4">

                  <div className="border p-5 rounded-xl sticky top-24">

                     <div className="text-center text-3xl font-bold mb-4">
                        {isFree ? "Free" : `$${course.price}`}
                     </div>

                     <button
                        onClick={handleEnrollment}
                        disabled={isEnrolling}
                        className="w-full bg-primary text-white py-3 rounded-lg"
                     >
                        {isEnrolling ? (
                           <Loader2 className="animate-spin mx-auto" />
                        ) : (
                           "Enroll Now"
                        )}
                     </button>

                  </div>

               </div>

            </div>

         </section>
      </div>
   );
}