import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import * as moment from 'moment';

// npm module "focusin": "^2.0.0",
require('focusin').polyfill();

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
        z-index: 10;
      }
    `],
})
export class DateDropdownComponent {
  private showDatepicker: boolean = false;
  private dateValueInDatepicker: Date | null;

    @Input()
    public dateFormat: string;

    @Input()
    public dateDisplayFormat: string;

    @Input()
    dateModel: string;
    @Output()
    dateModelChange: EventEmitter<string> = new EventEmitter();

    constructor(private htmlElement: ElementRef) {
    }

    get date() : string {
      return this.dateModel;
    }

    set date(value: string) {
      this.dateModel = value;
      this.dateModelChange.emit(value)

      let parsedDate = moment(value, this.dateFormat, true);
      
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

        this.date = moment(event).format(this.dateFormat);
    }

    @HostListener('focusout', ['$event'])
    onFocusout(event) {
      let targetElement = event && (event.relatedTarget || event.explicitOriginalTarget);
      if (targetElement) {
        let datepicketElement = this.htmlElement.nativeElement.querySelector("datepicker");
        let datepicketElementContainsClick = datepicketElement.contains(targetElement);
        if (datepicketElementContainsClick) {
          return;
        }
      }

      this.showDatepicker = false;                
    }
}
