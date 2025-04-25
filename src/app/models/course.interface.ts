import { Subcourse } from './sub-course.interface';

export interface Course {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  subcourses: Subcourse[];
}
