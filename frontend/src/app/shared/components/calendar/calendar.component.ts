import { Component, Input, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {

  @Input()
  daysToHighlight: NgbDateStruct[];

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
}
