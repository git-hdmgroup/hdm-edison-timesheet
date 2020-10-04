import { Component, ElementRef, forwardRef, Input, OnInit, Optional, Provider, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Moment } from 'moment';
import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

const WEEK_LENGTH = 7;

interface WeekDayCalendar {
  day: number;
  year: number;
  month;
  dayName: string;
  highlighted: boolean;
  today: boolean;
  selected: boolean;
}

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WeekCalendarComponent),
  multi: true,
};

@Component({
  selector: 'app-week-calendar',
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.sass'],
  providers: [VALUE_ACCESSOR]
})
export class WeekCalendarComponent implements ControlValueAccessor {

  @ViewChild('weekDayCalendarElement')
  weekDayCalendarElement: ElementRef<Element>;

  @Input()
  formControlName: string;

  @Input()
  highlightedDays: NgbDateStruct[] = [];

  @Input()
  showWeekNumber: true;

  isDisabled: boolean;

  value: string;

  week: WeekDayCalendar[] = [];
  from: Moment;
  to: Moment;

  arrowLeft = faArrowLeft;
  arrowRight = faArrowRight;
  home = faHome;

  fromToWeekFormat = 'MMM D';

  onModelChange;
  onTouch;

  private weekShift = 0;
  private readonly dateExchangeFormat = 'YYYY-MM-DD';

  constructor(@Optional() private controlContainer: ControlContainer) {
  }

  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get control(): FormControl {
    return this.form.get(this.formControlName) as FormControl;
  }

  get nativeElement() {
    return this.weekDayCalendarElement?.nativeElement;
  }

  writeValue(obj: string): void {
    this.value = obj;
    if (!moment(obj).isValid()) {
      this.value = moment().format(this.dateExchangeFormat);
    }
    this.calculateWeek();
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  calculateWeek(diff = 0) {
    if (this.isDisabled) {
      return;
    }

    this.week = [];

    if (!this.isDisabled) {
      this.weekShift += diff;
      this.from = moment(this.value).add(this.weekShift, 'w').startOf('isoWeek');
      this.to = moment(this.value).add(this.weekShift, 'w').endOf('isoWeek');
    }

    for (let i = 0; i < WEEK_LENGTH; i++) {
      this.week.push({
        day: Number(this.from.format('D')),
        month: Number(this.from.format('M')),
        year: Number(this.from.format('YYYY')),
        dayName: this.from.format('ddd'),
        highlighted: this.isHighlighted(this.from),
        today: this.isToday(this.from),
        selected: false
      });
      this.from.add(1, 'd');
    }

    this.from.subtract(WEEK_LENGTH, 'd');
  }

  resetCalendar() {
    this.value = moment().format(this.dateExchangeFormat);
    this.weekShift = 0;
    this.calculateWeek();
  }

  select(day: WeekDayCalendar) {
    if (this.isDisabled) {
      return;
    }

    this.week.forEach((weekDay) => {
      weekDay.selected = false;
      if (day === weekDay) {
        weekDay.selected = !weekDay.selected;
      }
    });

    const date = moment(`${day.year}-${day.month}-${day.day}`, 'YYYY-M-D').format(this.dateExchangeFormat);
    this.value = date;
    this.onModelChange(date);
  }

  isHighlighted(momentDate: Moment): boolean {
    const ngDate = this.momentToNgDate(momentDate);
    return this.highlightedDays.find(item =>
      item.year === ngDate.year && item.month === ngDate.month && item.day === ngDate.day) !== undefined;
  }

  isToday(momentDate: Moment) {
    const ngDateNow = this.momentToNgDate(moment());
    const ngDate = this.momentToNgDate(momentDate);
    return JSON.stringify(ngDateNow) === JSON.stringify(ngDate);
  }

  private momentToNgDate(momentDate: Moment): NgbDateStruct {
    return {
      day: Number(momentDate.format('D')),
      month: Number(momentDate.format('M')),
      year: Number(momentDate.format('YYYY')),
    };
  }
}
