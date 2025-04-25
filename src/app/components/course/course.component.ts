// ----------------------

import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/cources.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { CrudCase } from '../../models/crud-case.type';
import { Subcourse } from '../../models/sub-course.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessagesComponent } from '../validation-messages/validation-messages.component';

@Component({
  selector: 'app-course',
  imports: [
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    DatePipe,
    Dialog,
    DatePickerModule,
    InputTextModule,
    ValidationMessagesComponent,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit {
  courses: Course[] = [] as Course[];
  selectedCourse: Course = {} as Course;
  selectedSubCourse: Subcourse = {} as Subcourse;
  private readonly _courseService = inject(CourseService);
  readonly id = inject(PLATFORM_ID);
  crudCase: CrudCase = 'noThing';
  coursesForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      startDate: new FormControl(new Date(''), [Validators.required]),
      endDate: new FormControl(new Date(''), [Validators.required]),
    },
    { validators: this.matchDate }
  );
  errorInStartDate: boolean = false;
  errorInEndDate: boolean = false;
  showDaialog = false;
  idToAddOrEditCourse: number | undefined;
  idToAddOrEditSubCourse: number | undefined;
  getCourses() {
    this._courseService.coursesSubject.subscribe({
      next: (value) => {
        this.courses = value;
      },
    });
  }
  submitForm() {
    if (this.coursesForm.valid) {
      if (this.crudCase === 'addCourse') {
        this._courseService.addCourse(this.coursesForm.value);
        console.log(
          this.coursesForm.value.startDate < this.coursesForm.value.endDate
        );
        console.log(
          this.coursesForm.value.startDate > this.coursesForm.value.endDate
        );
        this.resetForm();
      } else if (this.crudCase === 'addSubCourse') {
        this._courseService.addSubcourse(
          this.idToAddOrEditCourse!,
          this.coursesForm.value
        );
      } else if (this.crudCase === 'editCourse') {
        this.coursesForm.value.id = this.selectedCourse.id;
        this.coursesForm.value.subcourses = this.selectedCourse.subcourses;
        this._courseService.updateCourse(this.coursesForm.value);
      } else if (this.crudCase === 'editSubCourse') {
        this.coursesForm.value.id = this.selectedSubCourse.id;
        this.coursesForm.value.CourseId = this.idToAddOrEditCourse;
        this._courseService.updateSubcourse(
          this.idToAddOrEditCourse!,
          this.coursesForm.value
        );
      }
      this.closeDialog();
    } else {
      this.coursesForm.markAllAsTouched();
    }
  }

  openDialog(crudCaseParam: CrudCase, courseId?: number, subCourseId?: number) {
    this.coursesForm.markAsUntouched();
    this.crudCase = crudCaseParam;
    this.idToAddOrEditCourse = courseId;
    this.idToAddOrEditSubCourse = subCourseId;
    this.showDaialog = true;
    if (this.crudCase === 'editCourse') {
      this.selectedCourse =
        this.courses.find((course) => course.id == this.idToAddOrEditCourse) ||
        ({} as Course);
      this.patchValues(
        this.selectedCourse.name,
        this.selectedCourse.startDate,
        this.selectedCourse.endDate
      );
    } else if (this.crudCase === 'addSubCourse') {
      this.selectedCourse =
        this.courses.find((course) => course.id == this.idToAddOrEditCourse) ||
        ({} as Course);
    } else if (this.crudCase === 'editSubCourse') {
      this.selectedCourse =
        this.courses.find((course) => course.id == this.idToAddOrEditCourse) ||
        ({} as Course);
      this.selectedSubCourse =
        this.selectedCourse.subcourses.find(
          (subcource) => subcource.id == this.idToAddOrEditSubCourse
        ) || ({} as Subcourse);
      this.patchValues(
        this.selectedSubCourse.name,
        this.selectedSubCourse.startDate,
        this.selectedSubCourse.endDate
      );
    }
  }
  patchValues(name: string, startDateParam: Date, endDateParam: Date) {
    this.coursesForm.setValue({
      name: name,
      startDate: startDateParam,
      endDate: endDateParam,
    });
  }
  closeDialog() {
    this.crudCase = 'noThing';
    this.showDaialog = false;
    this.resetForm();
  }
  resetForm() {
    this.coursesForm.setValue({
      name: '',
      startDate: '',
      endDate: '',
    });
  }
  matchDate(control: AbstractControl): object | null {
    return control.get('startDate')?.value <= control.get('endDate')?.value
      ? null
      : { mismatch: true };
    // if (control.get('startDate')?.value <= control.get('endDate')?.value) {
    //   return null;
    // } else if (
    //   !control.get('startDate')?.value <= control.get('endDate')?.value
    // ) {
    //   return { mismatch: true };
    // } else if (
    //   control.get('startDate')?.value < this.selectedCourse.startDate &&
    //   control.get('endDate')?.value > this.selectedCourse.endDate
    // ) {
    //   return null;
    // } else {
    //   if (control.get('startDate')?.value > this.selectedCourse.startDate) {
    //     return { mismatchSub: { mismatchStartDate: true } };
    //   } else if (control.get('endDate')?.value < this.selectedCourse.endDate) {
    //     return { mismatchSub: { mismatchEndDate: true } };
    //   } else {
    //     return { mismatchSub: { mismatctStartAndEndDate: true } };
    //   }
    // }
  }
  onDateChange() {
    if (this.crudCase === 'editSubCourse' || this.crudCase === 'addSubCourse') {
      if (
        this.selectedCourse.startDate > this.coursesForm.get('startDate')?.value
      ) {
        this.coursesForm
          .get('startDate')
          ?.setErrors({ unexpectedStartDate: true });
        return;
      }
      if (
        this.selectedCourse.endDate < this.coursesForm.get('startDate')?.value
      ) {
        this.coursesForm
          .get('startDate')
          ?.setErrors({ unexpectedStartDate: true });
        return;
      }
      if (
        this.coursesForm.get('endDate')?.value <= this.selectedCourse.startDate
      ) {
        this.coursesForm.get('endDate')?.setErrors({ unexpectedEndDate: true });
        console.log(this.coursesForm.get('endDate')?.value);
        console.log(this.selectedCourse.endDate);
        return;
      }
      if (
        this.coursesForm.get('endDate')?.value >= this.selectedCourse.endDate
      ) {
        console.log(this.coursesForm.get('endDate')?.value);
        console.log(this.selectedCourse.endDate);
        this.coursesForm.get('endDate')?.setErrors({ unexpectedEndDate: true });
        return;
      }

      return;
    }
  }
  ngOnInit(): void {
    this.getCourses();
  }
  ngAfterViewChecked() {
    if (this.showDaialog === false) {
      this.resetForm();
    }
  }
}
