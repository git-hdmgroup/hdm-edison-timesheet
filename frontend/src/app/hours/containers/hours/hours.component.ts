import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { City } from '../../../_interfaces/entities/city';
import { CityService } from '../../../_services/city/city.service';
import { Router } from '@angular/router';
import { HourView } from '../../../_interfaces/entities/hour-view';
import { HourService } from '../../../_services/hour/hour.service';
import { Hour } from '../../../_interfaces/entities/hour';
import { AuthService } from '../../../_services/auth/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  model: NgbDateStruct;
  date: { year: number, month: number };

  constructor(private hour: HourService,
              private auth: AuthService,
              private router: Router) {
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
