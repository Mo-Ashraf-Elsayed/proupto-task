import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-validation-messages',
  imports: [MessageModule],
  templateUrl: './validation-messages.component.html',
  styleUrl: './validation-messages.component.css',
})
export class ValidationMessagesComponent {
  @Input() control!: AbstractControl;
  @Input() inputName: string = '';
  // @Input() startDateCToAddSubC!: Date;
  // @Input() endDateCToAddSubC!: Date;
  // ngOnChanges() {
  // console.log(this.startDateCToAddSubC);
  // console.log(this.endDateCToAddSubC);
  // }
}
