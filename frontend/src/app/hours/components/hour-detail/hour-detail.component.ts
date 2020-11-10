import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Hour } from '../../../_interfaces/entities/hour';
import { HourService } from '../../../_services/hour/hour.service';
import { UserService } from '../../../_services/user/user.service';
import { AppUser } from '../../../_interfaces/entities/app-user';
import * as moment from 'moment';
import { ProjectService } from '../../../_services/project/project.service';
import { CostCenterService } from '../../../_services/cost-center/cost-center.service';
import { CityService } from '../../../_services/city/city.service';
import { Project } from '../../../_interfaces/entities/project';
import { CostCenter } from '../../../_interfaces/entities/cost-center';
import { City } from '../../../_interfaces/entities/city';
import { AuthService } from '../../../_services/auth/auth.service';
import { ROLES, ROLES_IDX } from '../../../_constants/roles';
import { booleanToNumber, fromMilliseconds, toMilliseconds } from '../../../_utils/utils';

@Component({
  selector: 'app-hour-detail',
  templateUrl: './hour-detail.component.html',
  styleUrls: ['./hour-detail.component.sass']
})
export class HourDetailComponent implements OnInit, OnDestroy {

  hourSubscription: Subscription;
  projectSubscription: Subscription;

  selectedHour: Hour;
  currentUser: AppUser;
  projects: Project[] = [];
  isLoadingData = false;
  isNewHour = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    project: ['', Validators.required],
    description: ['', Validators.required],
    time: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private hour: HourService,
              private project: ProjectService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      this.currentUser = this.auth.getCurrentUser();

      // Projects.
      this.projectSubscription = this.project.getAll(true).subscribe((data) => {
        this.projects = data;
      });

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewHour = true;
      } else {
        this.hourSubscription = this.hour.getHour(Number(id), true).subscribe((data) => {
          this.selectedHour = data;
          this.form.setValue({
            date: moment(this.selectedHour.datetime).format('YYYY-MM-DD'),
            project: this.selectedHour.project_id,
            description: this.selectedHour.description,
            time: fromMilliseconds('h', this.selectedHour.time),
            active: 1
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.hourSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: Hour = {
      datetime: moment(this.form.value.date, 'YYYY-MM-DD').utc().valueOf(),
      project_id: this.form.value.project,
      description: this.form.value.description,
      time: toMilliseconds('h', this.form.value.time),
      active: 1,
      id: this.isNewHour ? undefined : this.selectedHour.id,
      user_id: this.currentUser.id,
      valid_from: 0,
      valid_to: 0
    };

    this.hour.save(payload, this.isNewHour).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewHour ? 'app.hours.detail.insert' : 'app.hours.detail.update';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch((err) => {
      console.log(err);
      this.isLoadingData = false;
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
