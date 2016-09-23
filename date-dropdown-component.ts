import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'date-dropdown',
    template: `
      <input [(ngModel)]="date" (focus)="showPopup()" [attr.placeholder]="dateDisplayFormat" />
      <datepicker class="popup" *ngIf="showDatepicker" [(ngModel)]="dateValueInDatepicker" [showWeeks]="true" (ngModelChange)="acceptDateValue($event)" ></datepicker>
    `,
    styles: [`
      :host {
        position: relative;
      }

      .popup {
        position: absolute;
        background-color: #fff;
        border-radius: 3px;
        border: 1px solid #ddd;
        height: 251px;
        left: 0px;
        top: 25px;
        z-index: 1;
      }
    `],
})
export class DateDropdownComponent {
  private dateDisplayFormat: string = 'YYYY/MM/DD';

  private showDatepicker: boolean = false;
  private dateValueInDatepicker: Date | null;

    @Input()
    dateModel: string;
    @Output()
    dateModelChange: EventEmitter<string> = new EventEmitter();

    get date() : string {
      return this.dateModel;
    }

    set date(value: string) {
      this.dateModel = value;
      this.dateModelChange.emit(value)

      let parsedDate = moment(value, this.dateDisplayFormat, true);
      
      if (parsedDate.isValid()) {
        this.dateValueInDatepicker = parsedDate.toDate();
      }
      else {
        this.dateValueInDatepicker = null;
      }
    }

    showPopup() {
        this.showDatepicker = true;
    }

    acceptDateValue(event: Date) {
        this.showDatepicker = false;

        this.date = moment(event).format(this.dateDisplayFormat);
    }

    @HostListener('focusout', ['$event'])
    onFocusout(event) {
      if (event && event.relatedTarget) {
        let parentContainsTarget = event.currentTarget.contains(event.relatedTarget);
        if (parentContainsTarget) {
          return;
        }
      }

      this.showDatepicker = false;                
    }
}
