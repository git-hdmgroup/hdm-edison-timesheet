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
import { fromMilliseconds, toMilliseconds } from '../../../_utils/utils';

@Component({
  selector: 'app-hour-detail',
  templateUrl: './hour-detail.component.html',
  styleUrls: ['./hour-detail.component.sass']
})
export class HourDetailComponent implements OnInit, OnDestroy {

  hourSubscription: Subscription;
  userSubscription: Subscription;
  projectSubscription: Subscription;
  costCenterSubscription: Subscription;
  citySubscription: Subscription;

  selectedHour: Hour;
  currentUser: AppUser;
  users: AppUser[] = [];
  projects: Project[] = [];
  costCenters: CostCenter[] = [];
  cities: City[] = [];
  isLoadingData = false;
  isNewHour = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    date: ['', Validators.required],
    city: ['', Validators.required],
    project: ['', Validators.required],
    cost_center: ['', Validators.required],
    responsible: ['', Validators.required],
    description: ['', Validators.required],
    time: ['', Validators.required],
    active: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private hour: HourService,
              private user: UserService,
              private project: ProjectService,
              private costCenter: CostCenterService,
              private city: CityService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      this.currentUser = this.auth.getCurrentUser();

      // Users.
      this.userSubscription = this.user.getAll(true).subscribe((data) => {
        this.users = data.filter(item => item.role === ROLES[ROLES_IDX.RESPONSIBLE].role_id);
      });

      // Projects.
      this.projectSubscription = this.project.getAll(true).subscribe((data) => {
        this.projects = data;
      });

      // Cost Centers.
      this.costCenterSubscription = this.costCenter.getAll(true).subscribe((data) => {
        this.costCenters = data;
      });

      // Cities.
      this.citySubscription = this.city.getAll(true).subscribe((data) => {
        this.cities = data;
      });

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewHour = true;
      } else {
        this.hourSubscription = this.hour.getHour(Number(id), true).subscribe((data) => {
          this.selectedHour = data;
          this.form.setValue({
            date: moment(this.selectedHour.datetime).format('YYYY-MM-DD'),
            city: this.selectedHour.city_id,
            project: this.selectedHour.project_id,
            cost_center: this.selectedHour.cost_center_id,
            responsible: this.selectedHour.responsible_id,
            description: this.selectedHour.description,
            time: fromMilliseconds('h', this.selectedHour.time),
            active: this.selectedHour.active
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.hourSubscription?.unsubscribe();
    this.userSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
    this.costCenterSubscription.unsubscribe();
    this.citySubscription.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: Hour = {
      datetime: moment(this.form.value.date, 'YYYY-MM-DD').utc().valueOf(),
      city_id: this.form.value.city,
      project_id: this.form.value.project,
      cost_center_id: this.form.value.cost_center,
      responsible_id: this.form.value.responsible,
      description: this.form.value.description,
      time: toMilliseconds('h', this.form.value.time),
      active: this.form.value.active,
      id: this.isNewHour ? undefined : this.selectedHour.id,
      user_id: this.currentUser.id
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
