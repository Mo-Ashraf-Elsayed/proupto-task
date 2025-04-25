import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../models/course.interface';
import { Subcourse } from '../models/sub-course.interface';

@Injectable({ providedIn: 'root' })
export class CourseService {
  coursesSubject = new BehaviorSubject<Course[]>([
    {
      id: 1,
      name: 'course 1',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-06-01'),
      subcourses: [
        {
          id: 101,
          name: 'subcourse 1',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-05-07'),
          CourseId: 1,
        },
        {
          id: 102,
          name: 'subcourse 2',
          startDate: new Date('2024-05-08'),
          endDate: new Date('2024-05-14'),
          CourseId: 1,
        },
      ],
    },
    {
      id: 2,
      name: 'course 2',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-08-01'),
      subcourses: [
        {
          id: 201,
          name: 'subcourse 1',
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-07-07'),
          CourseId: 2,
        },
        {
          id: 202,
          name: 'subcourse 2',
          startDate: new Date('2024-07-08'),
          endDate: new Date('2024-07-14'),
          CourseId: 2,
        },
      ],
    },
  ]);

  private generateId(): number {
    return Math.floor(Math.random() * 100000);
  }
  addCourse(course: Course) {
    const current = this.coursesSubject.getValue();
    this.coursesSubject.next([
      ...current,
      { ...course, id: this.generateId(), subcourses: [] as Subcourse[] },
    ]);
  }

  updateCourse(updated: Course) {
    const current = this.coursesSubject.getValue();
    this.coursesSubject.next(
      current.map((c) => (c.id === updated.id ? updated : c))
    );
  }

  deleteCourse(id: number) {
    const current = this.coursesSubject.getValue();
    this.coursesSubject.next(current.filter((c) => c.id !== id));
  }

  addSubcourse(courseId: number, subcourse: Subcourse) {
    const current = this.coursesSubject.getValue();
    const updated = current.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          subcourses: [
            ...course.subcourses,
            { ...subcourse, id: this.generateId(), CourseId: courseId },
          ],
        };
      }
      return course;
    });
    this.coursesSubject.next(updated);
  }
  updateSubcourse(courseId: number, updatedSubcourse: Subcourse) {
    const current = this.coursesSubject.getValue();
    const updated = current.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          subcourses: [
            ...course.subcourses.map((c) =>
              c.id === updatedSubcourse.id ? updatedSubcourse : c
            ),
          ],
        };
      }
      return course;
    });
    this.coursesSubject.next(updated);
    // current.map((course) => {
    //   if (course.id == courseId) {
    //     course.subcourses = course.subcourses.map((c) => {
    //       console.log('Ashraf');
    //       return c.id == updatedSubcourse.id ? updatedSubcourse : c;
    //     });
    //   }
    // });
    // current
    //   .find((course) => course.id == courseId)
    //   ?.subcourses.map((c) =>
    //     c.id === updatedSubcourse.id ? updatedSubcourse : c
    //   );
  }
}
