"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import jsPDF from "jspdf";
import { useGetMyEnrollmentsQuery } from "@/redux/features/enroll/enrollApi";
import { History, CreditCard, Calendar, ArrowUpRight, CheckCircle2, PrinterIcon } from "lucide-react";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DataTable, { Column } from "@/components/common/DataTable";

// Type representing a single enrollment entry
interface Enrollment {
   id: string;
   enrolledAt: string | Date;
   course?: {
      title?: string;
      price?: number;
      thumbnail?: string;
   };
   // New user information from backend
   user?: {
      name?: string;
      email?: string;
   };
}

export default function StudentPaymentsPage() {
   const { t } = useTranslation();
   const { data, isLoading } = useGetMyEnrollmentsQuery();
   const enrollments: Enrollment[] = useMemo(() => {
      const list = Array.isArray(data?.data?.enrollments) ? data.data.enrollments : (Array.isArray(data?.data) ? data.data : []);
      return list.map((e: any) => ({ ...e, user: e.student }));
   }, [data]);

   const totalInvestment = useMemo(() =>
      enrollments.reduce((sum, item) => sum + (item.course?.price || 0), 0),
      [enrollments]);

   const downloadReceipt = (enrollment: Enrollment) => {
      // Create a new A4 PDF document with portrait orientation
      const doc = new jsPDF('p', 'mm', 'a4');
      const lineHeight = 10;
      let y = 20;

      // Set custom font (Helvetica Bold)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Mentoro Receipt', 105, y, { align: 'center' });
      y += lineHeight * 2;
      // Reset to regular font for details
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(14);
      doc.text(`Course: ${enrollment.course?.title || 'N/A'}`, 20, y);
      y += lineHeight;
      doc.text(`User: ${enrollment.user?.name || 'N/A'}`, 20, y);
      y += lineHeight;
      doc.text(`Email: ${enrollment.user?.email || 'N/A'}`, 20, y);
      y += lineHeight;
      doc.text(`Transaction ID: ${enrollment.id}`, 20, y);
      y += lineHeight;
      doc.text(`Amount: ${enrollment.course?.price?.toLocaleString() || '0'}`, 20, y);
      y += lineHeight;
      const formattedDate = enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('en-US') : 'N/A';
      doc.text(`Date: ${formattedDate}`, 20, y);
      y += lineHeight * 2;
      doc.setDrawColor(200);
      doc.rect(10, 10, 190, 277, 'S'); // A4 dimensions with margin

      // Save the PDF file
      doc.save(`receipt-${enrollment.id}.pdf`);
   };

   const columns: Column<any>[] = [
      {
         header: t("student.payments.table.details"),
         accessor: (item) => (
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden">
                  <img src={item.course?.thumbnail || "/placeholder.png"} className="w-full h-full object-cover" />
               </div>
               <div>
                  <p className="text-sm font-black text-foreground">{item.course?.title}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("student.payments.table.verified")}</p>
               </div>
            </div>
         )
      },
      {
         header: t("student.payments.table.date"),
         accessor: (item) => (
            <div className="flex items-center gap-2 text-muted-foreground">
               <Calendar className="w-3.5 h-3.5" />
               <span className="text-xs font-bold">{new Date(item.enrolledAt).toLocaleDateString()}</span>
            </div>
         )
      },
      {
         header: t("student.payments.table.status"),
         accessor: (item) => (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">
               <CheckCircle2 className="w-3 h-3" />
               {t("student.payments.table.completed")}
            </span>
         )
      },
      {
         header: t("student.payments.table.amount"),
         align: "right",
         accessor: (item) => (
            <p className="text-lg font-black text-foreground tracking-tighter">
               ${item.course?.price?.toLocaleString() || 0}
            </p>
         )
      },
      {
         header: "Download",
         align: "center",
         accessor: (item) => (
            <button type="button" className="btn-outline cursor-pointer" onClick={() => downloadReceipt(item)}>
               <PrinterIcon className="w-4 h-4" />
            </button>
         )
      }
   ];

   if (isLoading) {
      return (
         <div className="space-y-10 animate-pulse">
            <div className="h-20 bg-muted rounded-[2rem] w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="h-32 bg-muted rounded-[2.5rem]"></div>
               <div className="h-32 bg-muted rounded-[2.5rem]"></div>
               <div className="h-32 bg-muted rounded-[2.5rem]"></div>
            </div>
            <TableSkeleton rows={5} />
         </div>
      );
   }

   return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
         <DashboardHeader 
            badgeIcon={<History className="w-3.5 h-3.5" />}
            badgeText={t("student.payments.badge")}
            title={t("student.payments.title")}
            subtitle={t("student.payments.description")}
         />

         {/* ================= SUMMARY STATS ================= */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("student.payments.total_investment")}</p>
               <h3 className="text-4xl font-black text-foreground tracking-tighter">${totalInvestment.toLocaleString()}</h3>
            </div>
            <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("student.payments.active_assets")}</p>
               <h3 className="text-4xl font-black text-foreground tracking-tighter">{enrollments.length}</h3>
            </div>
            <div className="p-8 bg-primary text-white rounded-[2.5rem] relative overflow-hidden group shadow-xl shadow-primary/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">{t("student.payments.status_label")}</p>
               <h3 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                  {t("student.payments.verified")}
                  <CheckCircle2 className="w-8 h-8 opacity-40" />
               </h3>
            </div>
         </div>

         {/* ================= TRANSACTION TABLE ================= */}
         <DashboardCard
            header={
               <div>
                  <h2 className="text-2xl font-black tracking-tight">{t("student.payments.recent_transactions")}</h2>
                  <p className="text-muted-foreground font-medium text-xs">{t("student.payments.transaction_subtitle")}</p>
               </div>
            }
         >
            <DataTable 
               columns={columns}
               data={enrollments}
               isLoading={isLoading}
               loadingMessage="Loading transactions..."
               emptyState={{
                  title: t("student.payments.table.no_data") || "No transactions found",
                  description: "You have not completed any payments yet.",
                  icon: <History className="w-12 h-12" />
               }}
            />
         </DashboardCard>
      </div>
   );
}
