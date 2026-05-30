"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetMyCoursesQuery } from "@/redux/features/course/courseAPi";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Loader2, Download, ChevronLeft, Award } from "lucide-react";
import { useSelector } from "react-redux";

export default function CertificatePage() {
   const { t } = useTranslation();
   const params = useParams();
   const router = useRouter();
   const courseId = params.id as string;

   const { data, isLoading } = useGetMyCoursesQuery();
   const user = useSelector(selectCurrentUser);

   const coursesList = data?.data?.courses || data?.data || [];
   const course = coursesList.find((c: any) => c.id === courseId);
   const certificateRef = useRef<HTMLDivElement>(null);

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">{t("student.certificate.verifying")}</p>
         </div>
      );
   }

   // Double check if course is actually completed
   if (!course || course.progressPercentage < 100) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <h2 className="text-3xl font-black italic">{t("student.certificate.unavailable_title")}</h2>
            <p className="text-muted-foreground max-w-md">{t("student.certificate.unavailable_desc")}</p>
            <button onClick={() => router.push("/dashboard/student/my-courses")} className="h-10 px-6 bg-primary text-white font-bold rounded-lg text-sm">{t("student.certificate.back_to_courses")}</button>
         </div>
      );
   }

   const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

   const handlePrint = () => {
      window.print();
   };

    return (
      <div className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950/20">

         {/* Actions Bar (Hidden on Print) */}
         <div className="print:hidden max-w-5xl mx-auto px-4 pt-10 flex items-center justify-between mb-12">
            <button onClick={() => router.push("/dashboard/student/my-courses")} className="h-12 px-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all bg-card border border-border rounded-xl shadow-sm">
               <ChevronLeft className="w-4 h-4" /> {t("student.certificate.back_to_workspace")}
            </button>
            <div className="flex gap-4">
               <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 h-12 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                  <Download className="w-4 h-4" /> {t("student.certificate.export_pdf")}
               </button>
            </div>
         </div>

         {/* Certificate Container */}
         <div className="flex justify-center px-4 pb-20 print:p-0">
            <div
               ref={certificateRef}
               className="relative w-[1100px] h-[780px] bg-[#fffdfa] text-zinc-900 shadow-[0_50px_100px_rgba(0,0,0,0.15)] flex-shrink-0 print:shadow-none print:w-[297mm] print:h-[210mm] border-[20px] border-zinc-900 overflow-hidden"
               style={{ pageBreakAfter: "always" }}
            >
               {/* Guilloche / Ornate Border Patterns */}
               <div className="absolute inset-0 border-[2px] border-amber-600/20 m-2 pointer-events-none"></div>
               
               {/* Ornate Corners */}
               <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-600/40 m-6"></div>
               <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-600/40 m-6"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-600/40 m-6"></div>
               <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-600/40 m-6"></div>

               {/* Background Texture / Watermark */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                   <Award className="w-[500px] h-[500px] rotate-12" />
               </div>

               {/* Inner Content Wrapper */}
               <div className="absolute inset-12 border-2 border-zinc-900/5 flex flex-col items-center py-20 px-24 text-center">
                  
                  {/* Platform Branding */}
                  <div className="mb-10 flex flex-col items-center gap-2">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <div className="w-10 h-0.5 bg-amber-600/30"></div>
                        <Award className="w-8 h-8 text-amber-600" />
                        <div className="w-10 h-0.5 bg-amber-600/30"></div>
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                     </div>
                     <h1 className="text-xl font-black uppercase tracking-[0.5em] text-zinc-800">{t("student.certificate.academy_name")}</h1>
                     <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700">{t("student.certificate.academy_pro")}</p>
                  </div>

                  {/* Recognition Text */}
                  <div className="space-y-4 mb-12">
                     <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">{t("student.certificate.awarded_to")}</p>
                     
                     <div className="relative py-6">
                        <h2 className="text-7xl font-serif italic text-zinc-900 leading-tight underline decoration-amber-600/20 underline-offset-8" style={{ fontFamily: "Georgia, serif" }}>
                           {user?.name || t("student.certificate.distinguished_student")}
                        </h2>
                     </div>

                     <p className="max-w-2xl mx-auto text-lg text-zinc-500 font-medium leading-relaxed">
                        {t("student.certificate.recognition")}
                     </p>
                  </div>

                  {/* Course Name */}
                  <div className="mb-16">
                     <h3 className="text-4xl font-black text-zinc-900 tracking-tight px-10 relative inline-block">
                        <span className="relative z-10">{course.title}</span>
                        <div className="absolute -bottom-2 inset-x-0 h-4 bg-amber-600/10 -z-10"></div>
                     </h3>
                  </div>

                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-16">
                     {t("student.certificate.issued_on")} {currentDate} • {t("student.certificate.certificate_id")}: CM-{courseId.slice(0, 8).toUpperCase()}
                  </p>

                  {/* Bottom Verification Section */}
                  <div className="w-full mt-auto flex justify-between items-end">
                     
                     {/* Signature 1 */}
                     <div className="flex flex-col items-center">
                        <div className="w-56 mb-2 flex flex-col items-center">
                           <span className="font-serif italic text-3xl text-zinc-800 leading-none mb-2">{(course?.instructor?.name || t("student.certificate.platform_lead"))}</span>
                           <div className="w-full h-px bg-zinc-300"></div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t("student.certificate.head_curriculum")}</p>
                     </div>

                     {/* Official Seal */}
                     <div className="relative flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-double border-amber-600/40 p-1">
                           <div className="w-full h-full rounded-full bg-amber-600 flex flex-col items-center justify-center shadow-lg transform -rotate-12">
                              <Award className="w-10 h-10 text-amber-100 mb-1" />
                              <span className="text-[8px] font-black uppercase text-amber-950 tracking-widest">{t("student.certificate.official")}</span>
                              <span className="text-[8px] font-black uppercase text-amber-950 tracking-widest leading-none">{t("student.certificate.verified")}</span>
                           </div>
                        </div>
                        {/* Seal Ribbons */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 -z-10 opacity-60">
                            <div className="w-4 h-12 bg-amber-600 rotate-12"></div>
                            <div className="w-4 h-12 bg-amber-700 -rotate-12"></div>
                        </div>
                     </div>

                     {/* Signature 2 */}
                     <div className="flex flex-col items-center">
                        <div className="w-56 mb-2 flex flex-col items-center">
                            <div className="h-10 flex items-center">
                                <span className="font-serif italic text-2xl text-zinc-800">{t("student.certificate.management")}</span>
                            </div>
                           <div className="w-full h-px bg-zinc-300"></div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t("student.certificate.director")}</p>
                     </div>

                  </div>

               </div>

               {/* Outer Decorative Elements */}
               <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-2 border-amber-600/5 rounded-full"></div>
               <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 border-2 border-amber-600/5 rounded-full"></div>
            </div>
         </div>

         {/* Print Styles */}
         <style dangerouslySetInnerHTML={{
            __html: `
         @media print {
            body * {
               visibility: hidden;
            }
            main, main *, .container, .container * {
               visibility: visible !important;
            }
            .sidebar-container {
               display: none !important;
            }
            .certificate-container {
               position: absolute;
               left: 0;
               top: 0;
            }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            @page {
               size: A4 landscape;
               margin: 0;
            }
         }
       `}} />
      </div>
    );
}
