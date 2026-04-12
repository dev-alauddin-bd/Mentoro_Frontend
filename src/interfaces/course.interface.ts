// src/interfaces/course.interface.ts

import { ICategory } from "./category.interface";
import { IUser, SubmissionType } from "./user.interface";

export interface ICourse {
  id: string;
  title: string;
  description?: string | null;
  thumbnail: string;
  previewVideo: string;
  price: number;
  instructor?: string | null;
  isPublished: boolean;
  categoryId: string;
  category?: ICategory;
  modules?: IModule[];
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    enrolledUsers: number;
  };
}

export interface IModule {
  id: string;
  title: string;
  courseId: string;
  course?: ICourse;
  lessons?: ILesson[];
  assignment?: IAssignment | null;
  order: number;
}
export interface IAssignment {
  id: string;
  description: string;
  moduleId: string;
  module?: IModule;
}

export interface IEnrollment {
  id: string;
  userId: string;
  user?: IUser;
  courseId: string;
  course?: ICourse;
  enrolledAt: string | Date;
  lastActivity: string | Date;
}

export interface ICompletedLesson {
  id: string;
  userId: string;
  user?: IUser;
  lessonId: string;
  lesson?: ILesson;
  completedAt: string | Date;
}

export interface ILesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  moduleId: string;
  order: number;
  completedByUsers?: ICompletedLesson[];
  isCompleted?: boolean;
  isUnlocked?: boolean;
}


// Result of getMyCourses in backend
export interface IMyCourse {
  id: string;
  title: string;
  thumbnail: string;
  instructor: string | null;
  totalLessons: number;
  completedLessonsCount: number;
  progressPercentage: number;
  lastActivity: string | Date;
}

// Wrapper type for API response aligned with backend/src/app/utils/sendResponse.ts
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ICourseResponse = IApiResponse<ICourse & { isEnrolled?: boolean }>;
export type ICoursesResponse = IApiResponse<{
  courses: ICourse[];
  total: number;
  page: number;
  totalPages: number;
}>;

