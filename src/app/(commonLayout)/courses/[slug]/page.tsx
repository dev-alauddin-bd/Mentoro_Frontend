"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useGetCourseBySlugQuery } from "@/redux/features/course/courseAPi";

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
import RegistrationCard from "@/components/course-detail/RegistrationCard";

export default function CourseDetailsPage() {
   const params = useParams();
   const router = useRouter();

   const slug = params.slug as string;

   const { data, isLoading, refetch } = useGetCourseBySlugQuery(slug, {
      skip: !slug,
   });

   const course = data?.data;

   const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
   const [createCheckout] = useCreateCheckoutMutation();
   const [createReview] = useCreateReviewMutation();

   const [activeTab, setActiveTab] = useState<"details" | "curriculum" | "reviews">("details");
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
            <h1 className="text-xl font-semibold">Course not found</h1>
         </div>
      );
   }

   // ================= BACKEND DATA =================
   const isEnrolled = course?.isEnrolled || enrolled;
   const isFree = course?.price === 0;

   // ================= ENROLL =================
   const handleEnrollment = async () => {
      try {
         const res = await enrollCourse({ slug: slug as string }).unwrap();
         console.log(res);

         if (res?.success) {
            const checkout = await createCheckout({
               courseId: res.data.courseId,
               enrollId: res.data.id,
            }).unwrap();

            console.log(checkout);

            if (checkout?.success && checkout?.data?.paymentUrl) {
               window.location.href = checkout.data.paymentUrl;
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
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDE: HERO & MAIN BODY DETAILS */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* HERO SECTION */}
               <div className="space-y-6">
                  <button
                     onClick={() => router.back()}
                     className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" />
                     Back
                  </button>

                  <div>
                     <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium">
                        Premium Course
                     </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                     {course.title}
                  </h1>

                  <p className="text-lg text-muted-foreground max-w-3xl">
                     {course.description}
                  </p>

                  {/* COURSE METRICS */}
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base">
                     <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span>{course.enrollmentCount || 0}+ Students</span>
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
                     <div>
                        <div className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 shadow-sm text-sm font-medium">
                           <CheckCircle className="w-5 h-5 text-green-500" />
                           Certificate Included
                        </div>
                     </div>
                  )}
               </div>

               {/* TAB CONTENTS CONTAINER */}
               <div className="pt-6 border-t">
                  {/* TABS SELECTOR */}
                  <div className="flex gap-6 border-b pb-3 mb-6 overflow-x-auto scrollbar-none">
                     {["details", "curriculum", "reviews"].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab as any)}
                           className={`capitalize text-sm sm:text-base pb-1 whitespace-nowrap border-b-2 transition-all ${
                              activeTab === tab 
                                 ? "text-primary font-bold border-primary" 
                                 : "text-muted-foreground border-transparent hover:text-foreground"
                           }`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>

                  {/* DETAILS TAB */}
                  {activeTab === "details" && (
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold">What you’ll learn</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {(course.learningOutcomes || []).map((item: string, i: number) => (
                              <li key={i} className="flex gap-2 items-start">
                                 <CheckCircle className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                                 <span className="text-muted-foreground">{item}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}

                  {/* CURRICULUM TAB */}
                  {activeTab === "curriculum" && (
                     <div className="space-y-3">
                        {(course.modules || []).map((m: any, i: number) => (
                           <div key={m.id} className="border rounded-xl bg-background overflow-hidden">
                              <button
                                 onClick={() => toggleModule(m.id)}
                                 className="w-full flex justify-between items-center p-4 font-semibold text-left hover:bg-muted/50 transition-colors"
                              >
                                 <span>{i + 1}. {m.title}</span>
                                 <ChevronDown className={`w-4 h-4 transition-transform ${activeModule === m.id ? "rotate-180" : ""}`} />
                              </button>

                              {activeModule === m.id && (
                                 <div className="p-4 bg-muted/30 border-t space-y-2">
                                    {(m.lessons || []).map((l: any) => (
                                       <div
                                          key={l.id}
                                          className="flex justify-between items-center bg-background p-3 rounded-lg border text-sm shadow-sm"
                                       >
                                          <div className="flex items-center gap-2">
                                             <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                                             <span className="font-medium">{l.title}</span>
                                          </div>
                                          <span className="text-muted-foreground text-xs">{l.duration}m</span>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === "reviews" && (
                     <div className="space-y-6">
                        {isEnrolled && (
                           <form onSubmit={handleReviewSubmit} className="space-y-4 border p-4 rounded-xl bg-muted/10 shadow-sm">
                              <label className="block text-sm font-medium">Leave a Review</label>
                              <div className="flex gap-1">
                                 {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                       key={s}
                                       type="button"
                                       onClick={() => setRating(s)}
                                       className="transition-transform hover:scale-110"
                                    >
                                       <Star
                                          className={`w-6 h-6 ${
                                             s <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted border-muted"
                                          }`}
                                       />
                                    </button>
                                 ))}
                              </div>

                              <textarea
                                 value={comment}
                                 onChange={(e) => setComment(e.target.value)}
                                 className="w-full min-h-[100px] border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                 placeholder="Write your detailed review here..."
                              />

                              <button
                                 type="submit"
                                 className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                 disabled={isSubmittingReview}
                              >
                                 {isSubmittingReview ? "Submitting..." : "Submit Review"}
                              </button>
                           </form>
                        )}

                        <div className="space-y-4">
                           {(course.reviews || []).length === 0 ? (
                              <p className="text-center text-muted-foreground py-6">
                                 No reviews yet. Be the first to review!
                              </p>
                           ) : (
                              course.reviews.map((r: IReview) => (
                                 <div key={r.id} className="border p-4 rounded-xl bg-background shadow-sm space-y-1">
                                    <div className="font-semibold text-sm">{r.user?.name}</div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                       {r.content}
                                    </p>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  )}
               </div>

            </div>

            {/* RIGHT SIDE: FLOATING / STICKY REGISTRATION CARD */}
            <div className="lg:col-span-4">
               <div className="lg:sticky lg:top-24 mt-4 lg:mt-0">
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
   );
}