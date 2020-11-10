import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.sass']
})
export class DateFilterComponent implements OnInit {

  @Output()
  dateFilter = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  fromDate(from: number) {
    const now = new Date();
    const calcDate = moment(now).add((from * -1), 'month');
    const newDate = moment(`${calcDate.format('YYYY')}-${calcDate.format('MM')}-01`, 'YYYY-MM-DD');
    this.dateFilter.emit(newDate.utc().valueOf());
  }

  noDate() {
    this.dateFilter.emit(0);
  }
}
