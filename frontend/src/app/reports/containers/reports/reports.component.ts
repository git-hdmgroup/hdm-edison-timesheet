import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BupTableColumns } from '../../../shared/components/table/table.component';
import { ReportsFullView } from '../../../_interfaces/entities/reports-full-view';
import { ReportFullService } from '../../../_services/reports/report-full/report-full.service';
import { MomentifyPipe } from '../../../shared/pipes/momentify/momentify.pipe';
import { fromMilliseconds } from '../../../_utils/utils';
import { RolePipe } from '../../../shared/pipes/role/role.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../_services/project/project.service';
import { CostCenterService } from '../../../_services/cost-center/cost-center.service';
import { CityService } from '../../../_services/city/city.service';
import { AuthService } from '../../../_services/auth/auth.service';
import { FILTER_OPERATORS } from '../../../_constants/filter-commons';
import { CostCenter } from '../../../_interfaces/entities/cost-center';
import { City } from '../../../_interfaces/entities/city';
import { Project } from '../../../_interfaces/entities/project';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { UserService } from '../../../_services/user/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit, OnDestroy {

  reportFullViewSubscription: Subscription;
  projectSubscription: Subscription;
  costCenterSubscription: Subscription;
  citySubscription: Subscription;
  usersSubscription: Subscription;

  costCenters: CostCenter[] = [];
  cities: City[] = [];
  projects: Project[] = [];
  users: AppUser[] = [];

  isLoadingData = false;

  reportFullView: ReportsFullView[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  date: number = 0;

  columns: BupTableColumns[] = [
    {
      name: 'hour_datetime',
      label: 'app.reports.full.hour_datetime',
      transform: (item): string => {
        const pipe = new MomentifyPipe();
        return pipe.transform(item.hour_datetime, 'DD/MM/YYYY');
      },
      type: 'number',
      filterable: true
    },
    {name: 'hour_description', label: 'app.reports.full.hour_description', type: 'string'},
    {
      name: 'hour_time',
      label: 'app.reports.full.hour_time',
      transform: (item) => fromMilliseconds('h', item.hour_time),
      type: 'number',
      filterable: true
    },
    {name: 'project_name', label: 'app.reports.full.project_name', type: 'string', filterable: true},
    {name: 'project_typology', label: 'app.reports.full.project_typology', type: 'string', filterable: true},
    {name: 'project_cost_asset', label: 'app.reports.full.project_cost_asset', type: 'string'},
    {name: 'city_name', label: 'app.reports.full.city_name', type: 'string', filterable: true},
    {name: 'city_scope', label: 'app.reports.full.city_scope', type: 'string'},
    {name: 'cost_center_description', label: 'app.reports.full.cost_center_description', type: 'string'},
    {name: 'cost_center_garrison', label: 'app.reports.full.cost_center_garrison', type: 'string', filterable: true},
    {name: 'cost_center_name', label: 'app.reports.full.cost_center_name', type: 'string', filterable: true},
    {name: 'user_full_name', label: 'app.reports.full.user_full_name', type: 'string', filterable: true},
    {name: 'user_city_center_sender', label: 'app.reports.full.user_city_center_sender', type: 'string'},
    {name: 'position_name', label: 'app.reports.full.position_name', type: 'string', filterable: true},
    {name: 'position_cost', label: 'app.reports.full.position_cost', type: 'number'},
    {name: 'responsible_full_name', label: 'app.reports.full.responsible_full_name', type: 'string', filterable: true}
  ];

  form: FormGroup = this.formBuilder.group({
    city_id: null,
    cost_center_id: null,
    user_id: null,
    project_id: null
  });

  constructor(private reportFullService: ReportFullService,
              private project: ProjectService,
              private costCenter: CostCenterService,
              private city: CityService,
              private user: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    // Cost Centers.
    this.costCenterSubscription = this.costCenter.getAll(true).subscribe((data) => {
      this.costCenters = data;
    });

    // Cities.
    this.citySubscription = this.city.getAll(true).subscribe((data) => {
      this.cities = data;
    });

    // Projects.
    this.projectSubscription = this.project.getAll(true).subscribe((data) => {
      this.projects = data;
    });

    // Users.
    this.usersSubscription = this.user.getAll(true).subscribe((data) => {
      this.users = data;
    });

    this.reportFullViewSubscription = this.getReport();
  }

  getReport(where?: string) {
    return this.reportFullService.getAll(true, where).subscribe((data) => {
      this.reportFullView = data;
    });
  }

  dateFilter(filter: number) {
    this.date = filter;
    this.search();
  }

  search() {
    let where;
    const conditions = [];
    Object.keys(this.form.controls).forEach((control) => {
      const controlValue = this.form.controls[control].value;
      if (controlValue) {
        const condition = `${control}: {_eq: ${controlValue}}`;
        conditions.push(condition);
      }
    });

    const dateCondition = `hour_datetime: {_gte: ${this.date}}`;
    conditions.push(dateCondition);

    if (conditions.length > 0) {
      where = `(where: {${conditions.join(', ')}})`;
    }

    console.log(where);
    this.reportFullViewSubscription = this.getReport(where);
  }

  ngOnDestroy(): void {
    this.reportFullViewSubscription?.unsubscribe();
    this.projectSubscription.unsubscribe();
    this.costCenterSubscription.unsubscribe();
    this.citySubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }
}
