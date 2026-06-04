
// User role
export enum Role {
  student = "student",
  admin = "admin",
  instructor = "instructor",
}

export enum UserStatus {
  active = "active",
  blocked = "blocked",
}

// Assignment submission type
export enum SubmissionType {
  text = "text",
  link = "link",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  password?: string;
  role: Role;
  status: UserStatus;
  avatar?: string | null;
  enrolledCourses?: any;
  completedLessons?:any;
  createdAt: string;
  updatedAt: string;
  joinDate?: string;
  courses?: number;
}