"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGetCourseByIdQuery, useEnrollCourseMutation, useCreateCheckoutMutation, useGetAllCoursesQuery } from "@/redux/features/course/courseAPi";
import {
   PlayCircle, BookOpen, Clock, Users, Star, CheckCircle,
   ChevronDown, ChevronUp, Loader2, Award, Zap, Shield, X, MonitorPlay, BarChart,
   MessageSquare, Quote, Send, Check, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { IReview } from "@/interfaces/course.interface";
import { trackEvent } from "@/lib/gtag";

export default function EnhancedCourseDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const courseId = params.id as string;

   const { data: courseResponse, isLoading, refetch } = useGetCourseByIdQuery(courseId, {
      skip: !courseId
   });

   const { data: relatedCoursesData } = useGetAllCoursesQuery({
      limit: 5,
      category: courseResponse?.data?.categoryId
   });
   const relatedCourses = relatedCoursesData?.data?.courses?.filter((c: any) => c.id !== courseId).slice(0, 4) || [];

   const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
   const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();
   const [createReview] = useCreateReviewMutation();

   const user = useSelector(selectCurrentUser);

   const [activeModule, setActiveModule] = useState<string | null>(null);
   const [showVideoModal, setShowVideoModal] = useState(false);

   const [rating, setRating] = useState(5);
   const [comment, setComment] = useState("");
   const [isSubmittingReview, setIsSubmittingReview] = useState(false);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const searchParams = useSearchParams();

   useEffect(() => {
      if (searchParams.get("canceled")) {
         toast.error("Payment was canceled. You can try again when you're ready.");
      }
   }, [searchParams]);

   // Set the first module active by default when data loads
   useEffect(() => {
      if (courseResponse?.data?.modules && courseResponse.data.modules.length > 0 && !activeModule) {
         setActiveModule(courseResponse.data.modules[0].id);
      }
   }, [courseResponse, activeModule]);

   const course = courseResponse?.data;
   const isEnrolled = course?.isEnrolled;

   const handleEnrollment = async () => {
      // Track the click event
      trackEvent('enroll_button_click', {
         category: 'Engagement',
         label: course?.title,
         value: course?.price
      });

      try {
         const isFree = course?.price === 0;

         if (isFree) {
            await enrollCourse(courseId).unwrap();
            toast.success("Successfully enrolled in the free course!");
            refetch();
         } else {
            const res = await createCheckout(courseId).unwrap();
            console.log("checkout", res);
            if (res.data?.paymentUrl) {
               window.location.href = res.data.paymentUrl;
            } else {
               toast.error("Failed to initiate checkout");
            }
         }
      } catch (err: any) {
         if (err?.status === 401) {
            toast.error("Please login to enroll.");
            router.push("/login");
         } else {
            toast.error(err?.data?.message || "Failed to enroll. Please try again.");
         }
      }
   };

   const toggleModule = (moduleId: string) => {
      setActiveModule(activeModule === moduleId ? null : moduleId);
   };

   const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!comment.trim()) {
         toast.error("Please enter a comment");
         return;
      }

      try {
         setIsSubmittingReview(true);
         await createReview({
            courseId,
            rating,
            content: comment,
         }).unwrap();

         trackEvent('submit_review', { course_id: courseId, rating: rating });
         toast.success("Review submitted successfully!");
         setComment("");
         setRating(5);
         refetch();
      } catch (err: any) {
         toast.error(err?.data?.message || "Failed to submit review");
      } finally {
         setIsSubmittingReview(false);
      }
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 animate-spin text-primary" />
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Course Data...</p>
            </div>
         </div>
      );
   }

   if (!course) {
      return (
         <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-center px-4">
            <h2 className="text-4xl font-black italic mb-4">Course not found.</h2>
            <p className="text-muted-foreground font-medium mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => router.push("/courses")} className="h-12 px-8 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">Browse Courses</button>
         </div>
      );
   }

   const isFree = course.price === 0;
   const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

   // Calculate total duration roughly (assuming lesson.duration is in minutes)
   const totalDurationMinutes = course.modules?.reduce((acc, m) => {
      return acc + (m.lessons?.reduce((lAcc: number, l) => lAcc + (l.duration || 0), 0) || 0);
   }, 0) || 0;
   const hours = Math.floor(totalDurationMinutes / 60);
   const minutes = totalDurationMinutes % 60;

   return (
      <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">

         {/* Background Decorators */}
         <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
         <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

         {/* Hero Header Section */}
         <div className="relative pt-32 pb-24 border-b border-border/50 bg-gradient-to-b from-secondary/30 to-background">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">

               <div className="max-w-4xl space-y-8">
                  <button
                     onClick={() => router.push("/courses")}
                     className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-4"
                  >
                     <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                     Back to Courses
                  </button>

                  <div className="flex flex-wrap items-center gap-4">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        {course.category?.name || "Premium Course"}
                     </div>
                     <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> Top Rated
                     </div>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.05]">
                     {course.title}
                  </h1>

                  <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-3xl leading-relaxed">
                     {course.description || "Unlock comprehensive skills and take your knowledge to the next level with this expertly crafted course."}
                  </p>

                  <div className="flex flex-wrap items-center gap-8 pt-6">
                     <div className="flex items-center gap-4 bg-muted/50 py-2 px-5 rounded-full border border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center">
                           <span className="font-black text-sm text-primary uppercase">{course.instructor?.name?.slice(0, 2) || "IN"}</span>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Instructor</p>
                           <p className="text-sm font-bold text-foreground">{course.instructor?.name || "Expert Instructor"}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enrolled Students</span>
                           <div className="flex items-center gap-2 text-foreground">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">{course._count?.enrolledUsers || 0} Learners</span>
                           </div>
                        </div>

                        <div className="h-8 w-px bg-border"></div>

                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Duration</span>
                           <div className="flex items-center gap-2 text-foreground">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span className="font-bold text-sm">{hours > 0 ? `${hours}h ` : ''}{minutes}m</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content Split */}
         <div className="container mx-auto px-4 md:px-8 py-20 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">

               {/* Left Content (Curriculum) */}
               <div className="lg:col-span-7 space-y-16">

                  {/* Course Overview Highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="p-6 rounded-[2rem] bg-card border border-border/60 flex flex-col items-center text-center gap-3">
                        <MonitorPlay className="w-8 h-8 text-primary" />
                        <div className="space-y-1">
                           <p className="text-2xl font-black">{totalLessons}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lessons</p>
                        </div>
                     </div>
                     <div className="p-6 rounded-[2rem] bg-card border border-border/60 flex flex-col items-center text-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        <div className="space-y-1">
                           <p className="text-2xl font-black">{course.modules?.length || 0}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modules</p>
                        </div>
                     </div>
                     <div className="p-6 rounded-[2rem] bg-card border border-border/60 flex flex-col items-center text-center gap-3">
                        <BarChart className="w-8 h-8 text-emerald-500" />
                        <div className="space-y-1">
                           <p className="text-xl font-black px-2 mt-1">All Levels</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Skill Level</p>
                        </div>
                     </div>
                     <div className="p-6 rounded-[2rem] bg-card border border-border/60 flex flex-col items-center text-center gap-3">
                        <Award className="w-8 h-8 text-yellow-500" />
                        <div className="space-y-1">
                           <p className="text-xl font-black px-2 mt-1">Yes</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certificate</p>
                        </div>
                     </div>
                  </div>

                  {/* Curriculum Structure */}
                  <div>
                     <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-4">
                        <Zap className="text-amber-500" /> Course Curriculum Structure
                     </h2>

                     <div className="space-y-4">
                        {course.modules && course.modules.length > 0 ? (
                           course.modules.map((module, index) => (
                              <div
                                 key={module.id}
                                 className={`bg-card border rounded-[2rem] overflow-hidden transition-all duration-300 ${activeModule === module.id ? 'border-primary/50 shadow-xl shadow-primary/5' : 'border-border/60'}`}
                              >
                                 <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full px-6 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                                 >
                                    <div className="flex items-center gap-5">
                                       <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-colors ${activeModule === module.id ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
                                          {index + 1}
                                       </span>
                                       <div>
                                          <h3 className="font-black text-lg text-foreground leading-tight">{module.title}</h3>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 flex items-center gap-3">
                                             <span className="flex items-center gap-1"><MonitorPlay className="w-3 h-3" /> {module.lessons?.length || 0} Lessons</span>
                                             <span className="w-1 h-1 rounded-full bg-border"></span>
                                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {(module.lessons?.reduce((mAcc: number, l) => mAcc + (l.duration || 0), 0) || 0)} mins</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${activeModule === module.id ? 'bg-primary/10 text-primary rotate-180' : 'bg-secondary text-muted-foreground'}`}>
                                       <ChevronDown className="w-5 h-5" />
                                    </div>
                                 </button>

                                 {activeModule === module.id && (
                                    <div className="px-4 pb-4">
                                       <div className="p-2 border border-border/50 rounded-3xl bg-secondary/20">
                                          {module.lessons && module.lessons.length > 0 ? (
                                             <div className="space-y-1">
                                                {module.lessons.map((lesson, lIndex) => (
                                                   <div key={lesson.id} className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-background transition-colors group border border-transparent hover:border-border/80 hover:shadow-sm">
                                                      <div className="flex items-center gap-4">
                                                         <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                            <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                         </div>
                                                         <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Lesson {lIndex + 1}: {lesson.title}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                                                         {lesson.duration} mins
                                                      </div>
                                                   </div>
                                                ))}
                                             </div>
                                          ) : (
                                             <div className="p-8 text-center text-sm font-medium text-muted-foreground">
                                                No lessons available in this module yet.
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           ))
                        ) : (
                           <div className="p-16 text-center border border-border/60 rounded-[3rem] bg-card shadow-sm">
                              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                              <p className="font-black text-xl italic text-foreground mb-2">Curriculum in Progress.</p>
                              <p className="text-sm font-medium text-muted-foreground max-w-sm mx-auto">The instructor is actively structuring the modules and lessons for this course.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* =======================
                      REVIEWS SECTION
                  ======================= */}
                  <div className="pt-8 border-t border-border/50">
                     <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                           <MessageSquare className="text-primary" /> Student Reviews
                        </h2>
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary rounded-full border border-border">
                           <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                           <span className="text-sm font-black">{course.reviews && course.reviews.length > 0 ? (course.reviews.reduce((acc: number, r: IReview) => acc + r.rating, 0) / course.reviews.length).toFixed(1) : "0.0"}</span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase border-l border-border/50 pl-2 ml-1">{course.reviews?.length || 0} Reviews</span>
                        </div>
                     </div>

                     {/* Review Form for Enrolled Users */}
                     {isEnrolled && user && !course.reviews?.some((r: IReview) => r.userId === user.id) && (
                        <div className="mb-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>

                           <h3 className="text-xl font-black mb-6">Share Your Experience</h3>
                           <form onSubmit={handleSubmitReview} className="space-y-6 relative z-10">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Your Rating</label>
                                 <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                       <button
                                          key={star}
                                          type="button"
                                          onClick={() => setRating(star)}
                                          className="transform transition-all hover:scale-125 hover:-rotate-12"
                                       >
                                          <Star className={`w-8 h-8 ${star <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
                                       </button>
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Your Feedback</label>
                                 <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you liked about this course..."
                                    className="w-full h-32 p-6 rounded-3xl bg-background border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium resize-none"
                                 />
                              </div>

                              <button
                                 type="submit"
                                 disabled={isSubmittingReview}
                                 className="h-14 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                              >
                                 {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                 Submit Review
                              </button>
                           </form>
                        </div>
                     )}

                     {/* Reviews List */}
                     <div className="space-y-8">
                        {course.reviews && course.reviews.length > 0 ? (
                           course.reviews.map((review: IReview) => (
                              <div key={review.id} className="p-8 rounded-[2rem] bg-card border border-border/60 hover:border-primary/30 transition-all group">
                                 <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                       <div className="relative">
                                          <img
                                             src={review.user?.avatar || `https://i.pravatar.cc/150?u=${review.user?.name}`}
                                             alt={review.user?.name}
                                             className="w-16 h-16 rounded-2xl object-cover border-2 border-background shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                                          />
                                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                                             <Check className="w-3 h-3 text-white" />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                       <div className="flex items-center justify-between">
                                          <div>
                                             <h4 className="font-black text-lg text-foreground leading-none mb-1">{review.user?.name || "Verified Learner"}</h4>
                                             <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                   <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"}`} />
                                                ))}
                                             </div>
                                          </div>
                                          <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                                             {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </span>
                                       </div>
                                       <div className="relative">
                                          <Quote className="absolute -top-4 -left-4 w-8 h-8 text-primary/5 -z-10" />
                                          <p className="text-muted-foreground font-medium leading-relaxed italic pr-4">
                                             &quot;{review.content}&quot;
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 text-center border border-border/50 border-dashed rounded-[3rem] bg-secondary/10">
                              <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                              <p className="font-black text-xl italic text-foreground mb-2">No Reviews Yet.</p>
                              <p className="text-sm font-medium text-muted-foreground max-w-sm mx-auto">Be the first to share your learning experience!</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Card (Sticky Enrollment Card) */}
               <div className="lg:col-span-5 relative">
                  <div className="sticky top-24 bg-card border border-border/60 rounded-[3rem] p-8 shadow-2xl shadow-black/10 overflow-hidden transform transition-all duration-500 hover:border-primary/40 group/card">

                     {/* Premium Decorator */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] pointer-events-none transition-all group-hover/card:bg-primary/20"></div>

                     {/* Thumbnail / Video Preview Box */}
                     <div
                        onClick={() => course.previewVideo && setShowVideoModal(true)}
                        className={`relative aspect-video rounded-[2rem] overflow-hidden bg-secondary mb-10 border border-border/50 ${course.previewVideo ? 'cursor-pointer group' : ''} shadow-lg`}
                     >
                        <img
                           src={course.thumbnail !== 'demo-thumbnail.jpg' ? course.thumbnail : 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&q=80'}
                           alt={course.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {course.previewVideo && (
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/20">
                              <div className="flex flex-col items-center gap-3">
                                 <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform shadow-2xl">
                                    <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                                 </div>
                                 <span className="text-white text-xs font-black uppercase tracking-widest bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">Preview Course</span>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Pricing & Call to Action */}
                     <div className="space-y-8">
                        <div className="flex items-end gap-3 justify-center border-b border-border/50 pb-8">
                           {isFree ? (
                              <span className="text-6xl font-black tracking-tighter text-emerald-500 drop-shadow-sm">Free</span>
                           ) : (
                              <div className="flex items-baseline gap-2">
                                 <span className="text-6xl font-black tracking-tighter text-foreground">${course.price}</span>
                                 <span className="text-lg font-bold text-muted-foreground uppercase">USD</span>
                              </div>
                           )}
                        </div>
                        {/* =======================
   ENROLLED BUTTON
======================= */}
                        {isEnrolled ? (
                           <button
                              onClick={() => {
                                 trackEvent('continue_course', { course_id: courseId, course_name: course?.title });
                                 router.push(`/dashboard/student/my-courses/${courseId}`);
                              }}
                              className="w-full h-16 rounded-[1.5rem] cursor-pointer flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm bg-secondary text-foreground hover:bg-muted border border-border transition-all"
                           >
                              <CheckCircle className="w-5 h-5" />
                              Continue
                           </button>
                        ) : (
                           <button
                              onClick={handleEnrollment}
                              disabled={isEnrolling || isCheckingOut}
                              className="w-full h-16 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm bg-primary text-white hover:scale-[1.03] active:scale-95 shadow-primary/30 transition-all"
                           >
                              {isEnrolling || isCheckingOut ? (
                                 <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                 <PlayCircle className="w-5 h-5" />
                              )}

                              {isFree ? "Enroll Now for Free" : "Enroll Now"}
                           </button>
                        )}
                        {/* Features checklist */}
                        <div className="pt-2 space-y-4 px-2">
                           <div className="flex items-center gap-4 text-sm font-bold text-foreground">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><BookOpen className="w-4 h-4" /></div>
                              Full lifetime online access
                           </div>
                           <div className="flex items-center gap-4 text-sm font-bold text-foreground">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Shield className="w-4 h-4" /></div>
                              30-Day Money-Back Guarantee
                           </div>
                           <div className="flex items-center gap-4 text-sm font-bold text-foreground">
                              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><CheckCircle className="w-4 h-4" /></div>
                              High-quality premium curriculum
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Video Preview Modal */}
         {showVideoModal && course.previewVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
               <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
                  {/* Modal Header */}
                  <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
                     <h3 className="text-white font-black drop-shadow-md">Course Preview</h3>
                     <button
                        onClick={() => setShowVideoModal(false)}
                        className="w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Video Player */}
                  <div className="aspect-video w-full">
                     {(() => {
                        let finalUrl = course.previewVideo;
                        const ytMatch = finalUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                        if (ytMatch && ytMatch[2].length === 11) {
                           finalUrl = `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1`;
                        }

                        if (finalUrl?.includes("youtube.com/embed") || finalUrl?.includes("youtube-nocookie.com/embed") || finalUrl?.includes("vimeo.com")) {
                           return (
                              <iframe
                                 src={finalUrl}
                                 title="Course Preview"
                                 allowFullScreen
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 className="w-full h-full border-0 bg-black"
                              />
                           );
                        }

                        return (
                           <video
                              controls
                              autoPlay
                              className="w-full h-full object-contain bg-black"
                              src={finalUrl}
                           >
                              Your browser does not support the video tag.
                           </video>
                        );
                     })()}
                  </div>
               </div>
            </div>
         )}

         {/* Related Courses Section */}
         {relatedCourses.length > 0 && (
            <div className="container mx-auto px-4 md:px-8 py-24 max-w-7xl border-t border-border/50">
               <div className="flex items-center justify-between mb-12">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black tracking-tight italic">Related Courses</h2>
                     <p className="text-sm font-medium text-muted-foreground">Other courses you might find interesting in this category.</p>
                  </div>
                  <button
                     onClick={() => router.push("/courses")}
                     className="px-6 py-2 bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                     Explore All
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedCourses.map((c: any) => (
                     <div
                        key={c.id}
                        onClick={() => router.push(`/courses/${c.id}`)}
                        className="group cursor-pointer bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-2 shadow-sm"
                     >
                        <div className="aspect-video relative overflow-hidden">
                           <img src={c.thumbnail || "/placeholder.svg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="p-5 space-y-3">
                           <h4 className="font-black text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{c.title}</h4>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-primary uppercase">${c.price}</span>
                              <div className="flex items-center gap-1">
                                 <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                 <span className="text-[10px] font-black">4.9</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </div>
   );
}
