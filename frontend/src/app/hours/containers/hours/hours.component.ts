import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HourView } from '../../../_interfaces/entities/hour-view';
import { HourService } from '../../../_services/hour/hour.service';
import { Hour } from '../../../_interfaces/entities/hour';
import { AuthService } from '../../../_services/auth/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BupTableColumns } from '../../../shared/components/table/table.component';
import { MomentifyPipe } from '../../../shared/pipes/momentify/momentify.pipe';
import { fromMilliseconds } from '../../../_utils/utils';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.sass']
})
export class HoursComponent implements OnInit, OnDestroy {

  hourViewSubscription: Subscription;

  hoursView: HourView[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    weekDayCalendar: [moment().format('YYYY-MM-DD'), Validators.required]
  });

  highlight: NgbDateStruct[] = [
    {year: 2020, month: 5, day: 26},
    {year: 2020, month: 5, day: 14},
    {year: 2020, month: 5, day: 12},
    {year: 2020, month: 5, day: 23},
    {year: 2020, month: 5, day: 31},
    {year: 2020, month: 5, day: 10},
  ];

  columns: BupTableColumns[] = [
    {
      name: 'datetime',
      label: 'app.hours.date',
      transform: (item): string => {
        const pipe = new MomentifyPipe();
        return pipe.transform(item.datetime, 'DD/MM/YYYY');
      }
    },
    {name: 'project_name', label: 'app.hours.project_name'},
    {name: 'description', label: 'app.hours.description'},
    {name: 'time', label: 'app.hours.time', transform: (item) => fromMilliseconds('h', item.time)},
    {name: 'city', label: 'app.hours.city'},
  ];

  constructor(private hour: HourService,
              private auth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    this.hourViewSubscription = this.hour.getAllView(currentUser.id, true).subscribe((data) => {
      this.hoursView = data;
    });
  }

  ngOnDestroy(): void {
    this.hourViewSubscription?.unsubscribe();
  }

  openDetail(hour: Hour) {
    this.router.navigate([`/hours/${hour.id}`]);
  }

  add() {
    this.router.navigate(['/hours/new']);
  }

  test() {
    console.log(this.form.value);
  }

  remove(hour: Hour) {
    this.hour.deactivate(hour).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.hours.removed';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch(() => {
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
