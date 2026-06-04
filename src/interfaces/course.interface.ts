



export interface Icourse {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  price: number;
  enrollments: number;
  category: string;
  instructor: string;
  instructorAvatar: string | null;
}

export interface ICoursesResponse {
  success: boolean;
  message: string;
  data: Icourse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


export interface ICourseResponse {
  success: boolean;
  message: string;
  data: Icourse;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ILesson {
  id: string;
  title: string;
  duration: number;
  type: string;
  videoUrl?: string;
  text?: string;
}

export interface IReview {
  id: string;
  rating: number;
  text: string;
 
  userAvatar: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export interface ICourseDetails extends Icourse {
  lessons: ILesson[];
  reviews: IReview[];
  totalLessons: number;
  totalVideos: number;
  totalDuration: number;
  enrolledStudents: number;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICourseDetailsResponse {
  success: boolean;
  message: string;
  data: ICourseDetails;
}
export interface ILesson {
  id: string;
  title: string;
  duration: number;
}

export interface IModule {
  id: string;
  title: string;
  lessons: ILesson[];
}

export interface IReview {
  id: string;
  rating: number;
  content: string;
  user?: {
    name: string;
  };
}

export interface ICourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  price: number;

  enrollmentCount: number;

  category: {
    id: string;
    name: string;
  } | null;

  instructor: {
    id: string;
    name: string;
    avatar?: string;
  } | null;

  previewVideo?: string;

  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  tags: string[];

  modules: IModule[];
  reviews: IReview[];

  hasCertificate: boolean;

  // backend computed
  totalLessons: number;
  totalDuration: number;

  // optional (if you send later)
  isEnrolled?: boolean;
}