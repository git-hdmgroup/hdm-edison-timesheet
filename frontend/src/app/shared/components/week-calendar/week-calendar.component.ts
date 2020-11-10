import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  Optional,
  Provider,
  ViewChild,
  Output,
  EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Moment } from 'moment';
import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

const WEEK_LENGTH = 7;
const WORKING_HOURS_DAY = 28800000;

export interface HighlightedDays {
  year: number;
  month: number;
  day: number;
  time: number;
}

export interface WeekDayCalendar {
  day: number;
  year: number;
  month;
  dayName: string;
  highlighted: boolean;
  today: boolean;
  selected: boolean;
  completed: boolean;
  time: number;
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
export class WeekCalendarComponent implements ControlValueAccessor, OnChanges {

  @ViewChild('weekDayCalendarElement')
  weekDayCalendarElement: ElementRef<Element>;

  @Input()
  formControlName: string;

  @Input()
  highlightedDays: HighlightedDays[] = [];

  @Input()
  showWeekNumber: true;

  @Output()
  selectedDay = new EventEmitter<any>();

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
    console.log(obj);
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
        selected: false,
        completed: this.isComplete(this.from),
        time: Number((this.calculateTime(this.from) / 60 / 60 / 1000).toFixed(1))
      });
      this.from.add(1, 'd');
    }
    this.from.subtract(WEEK_LENGTH, 'd');
  }

  resetCalendar() {
    this.value = moment().format(this.dateExchangeFormat);
    this.weekShift = 0;
    this.calculateWeek();
    this.selectedDay.emit(0);
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

    const dateString = `${day.year}-${day.month}-${day.day}`;
    const datetime = moment(dateString, 'YYYY-M-D').utc().valueOf();
    this.selectedDay.emit(datetime);
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

  isComplete(momentDate: Moment) {
    const ngDate = this.momentToNgDate(momentDate);
    const daysToCount = this.highlightedDays.filter(item =>
      item.year === ngDate.year && item.month === ngDate.month && item.day === ngDate.day);

    let timeSum = 0;
    daysToCount.forEach(day => timeSum += day.time);

    return timeSum >= WORKING_HOURS_DAY;
  }

  calculateTime(momentDate: Moment) {
    const ngDate = this.momentToNgDate(momentDate);
    const daysToCount = this.highlightedDays.filter(item =>
      item.year === ngDate.year && item.month === ngDate.month && item.day === ngDate.day);

    let timeSum = 0;
    daysToCount.forEach(day => timeSum += day.time);

    return timeSum;
  }

  private momentToNgDate(momentDate: Moment): NgbDateStruct {
    return {
      day: Number(momentDate.format('D')),
      month: Number(momentDate.format('M')),
      year: Number(momentDate.format('YYYY')),
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.highlightedDays && changes.highlightedDays.previousValue && changes.highlightedDays.previousValue.length === 0) {
      this.calculateWeek();
    }
  }
}
