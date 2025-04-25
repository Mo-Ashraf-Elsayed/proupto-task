import { Component } from '@angular/core';
import { CourseComponent } from './components/course/course.component';

@Component({
  selector: 'app-root',
  imports: [CourseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'proupto-task';
}
