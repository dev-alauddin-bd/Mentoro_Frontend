
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
   useCreateCheckoutMutation,
   useEnrollCourseMutation,

   useGetAllPublicCoursesQuery,
   useGetCourseBySlugQuery,

} from "@/redux/features/course/courseAPi";

import {
   ArrowLeft,
   BookOpen,
   CheckCircle,
   ChevronDown,
   Clock,
   Loader2,
   MessageSquare,
   MonitorPlay,
   PlayCircle,
   Star,
   Users,
} from "lucide-react";

import toast from "react-hot-toast";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { IReview } from "@/interfaces/course.interface";

export default function EnhancedCourseDetailsPage() {
   const params = useParams();
   const router = useRouter();

   const slug = params.slug as string;

   const { data, isLoading, refetch } = useGetCourseBySlugQuery(slug, {
      skip: !slug,
   });

   const course = data?.data;

   const { data: relatedCoursesData } = useGetAllPublicCoursesQuery({
      limit: 5,
      category: course?.categoryId,
   });

   const relatedCourses = useMemo(() => {
      return (
         relatedCoursesData?.data?.courses
            ?.filter((c: any) => c.id !== slug)
            .slice(0, 4) || []
      );
   }, [relatedCoursesData, slug]);

   const [enrollCourse, { isLoading: isEnrolling }] =
      useEnrollCourseMutation();

   const [createCheckout, { isLoading: isCheckingOut }] =
      useCreateCheckoutMutation();

   const [createReview] = useCreateReviewMutation();


   const [activeModule, setActiveModule] = useState<string | null>(null);

   const [activeTab, setActiveTab] = useState<
      "details" | "curriculum" | "reviews"
   >("details");

   const [rating, setRating] = useState(5);

   const [comment, setComment] = useState("");

   const [isSubmittingReview, setIsSubmittingReview] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   useEffect(() => {
      if (
         course?.modules &&
         course.modules.length > 0 &&
         !activeModule
      ) {
         setActiveModule(course.modules[0].id);
      }
   }, [course, activeModule]);

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

   const isEnrolled = course?.isEnrolled;
   const isFree = course?.price === 0;

   const totalLessons =
      course.modules?.reduce(
         (acc: number, module: any) =>
            acc + (module.lessons?.length || 0),
         0
      ) || 0;

   const totalDuration =
      course.modules?.reduce(
         (acc: number, module: any) =>
            acc +
            (module.lessons?.reduce(
               (lessonAcc: number, lesson: any) =>
                  lessonAcc + (lesson.duration || 0),
               0
            ) || 0),
         0
      ) || 0;

   const handleEnrollment = async () => {
      try {
         if (!course?.id) return;

         if (isFree) {
            await enrollCourse(course.id).unwrap();

            toast.success("Successfully enrolled!");

            refetch();

            router.push(
               `/dashboard/student/my-courses/${course.slug || course.id}`
            );
         } else {
            const res = await createCheckout(course.id).unwrap();
            console.log("Res", res);

            if (res?.data?.paymentUrl) {
               window.location.href = res.data.paymentUrl;
            }
         }
      } catch (err: any) {
         toast.error(
            err?.data?.message || "Enrollment failed"
         );
      }
   };

   const toggleModule = (id: string) => {
      setActiveModule(activeModule === id ? null : id);
   };

   const handleReviewSubmit = async (
      e: React.FormEvent
   ) => {
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
         toast.error(
            err?.data?.message || "Review failed"
         );
      } finally {
         setIsSubmittingReview(false);
      }
   };

   return (
      <div className="min-h-screen bg-background">

         {/* HERO */}
         <section className="border-b border-border py-20">
            <div className="container mx-auto max-w-7xl px-4">

               <button
                  onClick={() => router.push("/courses")}
                  className="flex items-center gap-2 mb-6 text-sm font-medium"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back
               </button>

               <div className="space-y-6 max-w-4xl">

                  <div className="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                     {course.category?.name || "Course"}
                  </div>

                  <h1 className="text-5xl font-black">
                     {course.title}
                  </h1>

                  <p className="text-muted-foreground text-lg leading-relaxed">
                     {course.description}
                  </p>

                  <div className="flex flex-wrap gap-8 pt-4">

                     {course.instructor && (
                        <div className="flex items-center gap-2">
                           <img src={course.instructor.avatar || "/placeholder.svg"} alt={course.instructor.name} className="w-8 h-8 rounded-full" />
                           <span className="font-medium text-foreground">{course.instructor.name}</span>
                        </div>
                     )}

                     <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                           {course._count?.enrolledUsers || 0} Students
                        </span>
                     </div>

                     <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>
                           {course.modules?.length || 0} Modules
                        </span>
                     </div>

                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{totalDuration} mins</span>
                     </div>

                  </div>

                  {(course.tags ?? []).length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2">
                        {course.tags?.map((tag: string, index: number) => (
                           <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                              {tag}
                           </span>
                        ))}
                     </div>
                  )}

               </div>
            </div>
         </section>

         {/* MAIN */}
         <section className="container mx-auto max-w-7xl px-4 py-14">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

               {/* LEFT */}
               <div className="lg:col-span-7 space-y-12">

                  {/* TABS */}
                  <div className="flex gap-4 border-b border-border pb-3">

                     {(["details", "curriculum", "reviews"] as const).map(
                        (tab) => (
                           <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab
                                    ? "border-b-2 border-primary text-primary"
                                    : "text-muted-foreground"
                                 }`}
                           >
                              {tab}
                           </button>
                        )
                     )}
                  </div>

                  {/* DETAILS */}
                  {activeTab === "details" && (
                     <div className="space-y-10">

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                           <div className="p-6 border rounded-3xl text-center">
                              <MonitorPlay className="w-8 h-8 mx-auto text-primary mb-3" />
                              <h3 className="text-2xl font-black">
                                 {totalLessons}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                 Lessons
                              </p>
                           </div>

                           <div className="p-6 border rounded-3xl text-center">
                              <BookOpen className="w-8 h-8 mx-auto text-primary mb-3" />
                              <h3 className="text-2xl font-black">
                                 {course.modules?.length || 0}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                 Modules
                              </p>
                           </div>

                        </div>

                        {(course.learningOutcomes ?? []).length > 0 && (
                           <div>
                              <h2 className="text-3xl font-black mb-6">What You’ll Learn</h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {(course.learningOutcomes ?? []).map(
                                    (item: string, index: number) => (
                                       <div
                                          key={index}
                                          className="flex items-start gap-3 p-4 border rounded-2xl"
                                       >
                                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                          <span>{item}</span>
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                        {(course.requirements ?? []).length > 0 && (
                           <div>
                              <h2 className="text-3xl font-black mb-6">Requirements</h2>
                              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                 {course.requirements?.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                 ))}
                              </ul>
                           </div>
                        )}

                        {(course.targetAudience ?? []).length > 0 && (
                           <div>
                              <h2 className="text-3xl font-black mb-6">Who this course is for</h2>
                              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                 {course.targetAudience?.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                 ))}
                              </ul>
                           </div>
                        )}

                     </div>
                  )}

                  {/* CURRICULUM */}
                  {activeTab === "curriculum" && (
                     <div className="space-y-4">

                        {course.modules?.map(
                           (module: any, index: number) => (
                              <div
                                 key={module.id}
                                 className="border rounded-3xl overflow-hidden"
                              >

                                 <button
                                    onClick={() =>
                                       toggleModule(module.id)
                                    }
                                    className="w-full flex items-center justify-between p-6"
                                 >
                                    <div>
                                       <h3 className="font-black text-lg">
                                          {index + 1}. {module.title}
                                       </h3>
                                    </div>

                                    <ChevronDown className="w-5 h-5" />
                                 </button>

                                 {activeModule === module.id && (
                                    <div className="px-6 pb-6 space-y-3">

                                       {module.lessons?.map(
                                          (lesson: any) => (
                                             <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-secondary"
                                             >
                                                <div className="flex items-center gap-3">
                                                   <PlayCircle className="w-4 h-4" />
                                                   <span>
                                                      {lesson.title}
                                                   </span>
                                                </div>

                                                <span className="text-sm">
                                                   {lesson.duration}m
                                                </span>
                                             </div>
                                          )
                                       )}

                                    </div>
                                 )}
                              </div>
                           )
                        )}

                     </div>
                  )}

                  {/* REVIEWS */}
                  {activeTab === "reviews" && (
                     <div className="space-y-8">

                        {isEnrolled && (
                           <form
                              onSubmit={handleReviewSubmit}
                              className="p-8 border rounded-3xl space-y-6"
                           >

                              <div className="flex gap-2">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                       key={star}
                                       type="button"
                                       onClick={() => setRating(star)}
                                    >
                                       <Star
                                          className={`w-6 h-6 ${star <= rating
                                             ? "fill-yellow-500 text-yellow-500"
                                             : "text-gray-300"
                                             }`}
                                       />
                                    </button>
                                 ))}
                              </div>

                              <textarea
                                 value={comment}
                                 onChange={(e) =>
                                    setComment(e.target.value)
                                 }
                                 placeholder="Write your review..."
                                 className="w-full h-32 border rounded-2xl p-4"
                              />

                              <button
                                 type="submit"
                                 disabled={isSubmittingReview}
                                 className="h-12 px-6 bg-primary text-white rounded-xl"
                              >
                                 {isSubmittingReview
                                    ? "Submitting..."
                                    : "Submit Review"}
                              </button>
                           </form>
                        )}

                        <div className="space-y-6">

                           {(course.reviews ?? []).length > 0 ? (
                              (course.reviews ?? []).map((review: IReview) => (
                                 <div
                                    key={review.id}
                                    className="border rounded-3xl p-6"
                                 >
                                    <div className="flex items-center justify-between mb-4">
                                       <div>
                                          <h4 className="font-black">
                                             {review.user?.name}
                                          </h4>
                                          <div className="flex gap-1 mt-1">
                                             {[...Array(5)].map((_, i) => (
                                                <Star
                                                   key={i}
                                                   className={`w-4 h-4 ${i < review.rating
                                                         ? "fill-yellow-500 text-yellow-500"
                                                         : "text-gray-300"
                                                      }`}
                                                />
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                    <p className="text-muted-foreground">
                                       {review.content}
                                    </p>
                                 </div>
                              ))
                           ) : (
                              <div className="py-16 text-center border border-dashed rounded-3xl">
                                 <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                                 <p className="font-black text-lg">No reviews yet</p>
                                 <p className="text-sm text-muted-foreground mt-1">
                                    {isEnrolled
                                       ? "Be the first to share your experience!"
                                       : "Enroll in this course to leave a review."}
                                 </p>
                              </div>
                           )}

                        </div>
                     </div>
                  )}

               </div>

               {/* RIGHT SIDEBAR */}
               <div className="lg:col-span-5">

                  <div className="sticky top-24 border rounded-[2rem] p-6 bg-card">

                     <div className="space-y-6">

                        <div className="aspect-video rounded-2xl overflow-hidden">

                           <img
                              src={
                                 course.thumbnail ||
                                 "/placeholder.svg"
                              }
                              alt={course.title}
                              className="w-full h-full object-cover"
                           />

                        </div>

                        <div className="text-center">

                           {isFree ? (
                              <h2 className="text-5xl font-black text-green-500">
                                 Free
                              </h2>
                           ) : (
                              <h2 className="text-5xl font-black">
                                 ${course.price}
                              </h2>
                           )}

                        </div>

                        {isEnrolled ? (
                           <button
                              onClick={() =>
                                 router.push(
                                    `/dashboard/student/my-courses/${slug}`
                                 )
                              }
                              className="w-full h-14 rounded-2xl bg-secondary font-bold"
                           >
                              Continue Course
                           </button>
                        ) : (
                           <button
                              onClick={handleEnrollment}
                              disabled={
                                 isEnrolling || isCheckingOut
                              }
                              className="w-full h-14 rounded-2xl bg-primary text-white font-bold"
                           >

                              {isEnrolling ||
                                 isCheckingOut ? (
                                 <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                              ) : (
                                 "Enroll Now"
                              )}

                           </button>
                        )}

                        <div className="space-y-4 pt-4">

                           <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Full lifetime access</span>
                           </div>

                           <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Certificate included</span>
                           </div>

                           <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>Premium support</span>
                           </div>

                        </div>

                     </div>

                  </div>

               </div>

            </div>
         </section>

         {/* RELATED COURSES – always visible below the main grid */}
         {relatedCourses.length > 0 && (
            <section className="container mx-auto max-w-7xl px-4 pb-20">
               <div className="border-t border-border pt-14">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-black">Related Courses</h2>
                     <button
                        onClick={() => router.push("/courses")}
                        className="text-sm font-medium text-primary hover:underline"
                     >
                        View all →
                     </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {relatedCourses.map((item: any) => (
                        <div
                           key={item.id}
                           onClick={() => router.push(`/courses/${item.slug || item.id}`)}
                           className="group border rounded-3xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
                        >
                           <div className="aspect-video overflow-hidden">
                              <img
                                 src={item.thumbnail || "/placeholder.svg"}
                                 alt={item.title}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           </div>
                           <div className="p-5 space-y-1">
                              <h3 className="font-black line-clamp-2 group-hover:text-primary transition-colors">
                                 {item.title}
                              </h3>
                              <p className="text-primary font-bold">
                                 {item.price === 0 ? "Free" : `$${item.price}`}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}
      </div>
   );
}
