import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {

  @Input()
  daysToHighlight: NgbDateStruct[];

  @Output()
  selectedDay = new EventEmitter<NgbDateStruct>();

  test: NgbDate;
  model: NgbDateStruct;
  date: { year: number, month: number };

  constructor() {
  }

  ngOnInit(): void {
  }

  dateHighlighted(date: NgbDateStruct): boolean {
    return this.daysToHighlight.find(item =>
      JSON.stringify(item) === JSON.stringify(date)) !== undefined;
  }

  isToday(date: any) {
    console.log(date);
  }

  selectDay(date: NgbDateStruct) {
    this.selectedDay.emit(date);
  }
}
