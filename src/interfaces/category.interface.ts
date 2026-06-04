import { Icourse } from "./course.interface";

export interface ICategory {
  id: string;
  name: string;
  courses?: Icourse[];
  createdAt: Date;
  updatedAt: Date;
} 