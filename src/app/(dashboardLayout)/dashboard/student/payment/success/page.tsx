"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMyCoursesQuery } from "@/redux/features/course/courseAPi";

export default function PaymentSuccessPage() {
  const { data, refetch, isFetching } = useGetMyCoursesQuery();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Polling mechanism to ensure backend webhook has finished
    const checkCourses = async () => {
      const result = await refetch();
      const courses = result.data?.data?.courses || result.data?.data || [];
      
      if (courses.length > 0) {
        setIsReady(true);
      } else {
        // If still 0, wait 2 seconds and check again
        setTimeout(() => {
          checkCourses();
        }, 2000);
      }
    };

    // Safety timeout: stop polling after 10 seconds anyway
    const maxWait = setTimeout(() => {
      setIsReady(true);
    }, 10000);

    checkCourses();

    return () => clearTimeout(maxWait);
  }, [refetch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-full mb-6">
        <CheckCircle className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Thank you for your purchase. Your payment was successful and you are now enrolled in the course.
      </p>
      
      <div className="flex gap-4 min-h-[50px]">
        {!isReady || isFetching ? (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-bold text-sm">Syncing your course...</span>
          </div>
        ) : (
          <Button asChild>
            <Link href="/dashboard/student/my-courses">Go to My Courses</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
