import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_services/auth/auth.service';
import { Project } from 'src/app/_interfaces/entities/project';
import { ProjectService } from '../../../_services/project/project.service';
import * as moment from 'moment';
import { booleanToNumber } from '../../../_utils/utils';
import { CostCenter } from '../../../_interfaces/entities/cost-center';
import { City } from '../../../_interfaces/entities/city';
import { CostCenterService } from '../../../_services/cost-center/cost-center.service';
import { CityService } from '../../../_services/city/city.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.sass']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  projectSubscription: Subscription;
  costCenterSubscription: Subscription;
  citySubscription: Subscription;

  costCenters: CostCenter[] = [];
  cities: City[] = [];

  selectedProject: Project;
  isLoadingData = false;
  isNewProject = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    city: [null, Validators.required],
    cost_center: [null, Validators.required],
    cost_asset: ['', Validators.required],
    typology: ['', Validators.required],
    description: ['', Validators.required],
    active: [null, Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private project: ProjectService,
              private costCenter: CostCenterService,
              private city: CityService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

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
        this.isNewProject = true;
      } else {
        this.projectSubscription = this.project.getProject(Number(id), true).subscribe((data) => {
          this.selectedProject = data;
          this.form.setValue({
            city: this.selectedProject.city_id,
            cost_center: this.selectedProject.cost_center_id,
            cost_asset: this.selectedProject.cost_asset,
            typology: this.selectedProject.typology,
            description: this.selectedProject.description,
            active: this.selectedProject.active
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
    this.costCenterSubscription?.unsubscribe();
    this.citySubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: Project = {
      city_id: this.form.value.city,
      cost_center_id: this.form.value.cost_center,
      cost_asset: this.form.value.cost_asset,
      typology: this.form.value.typology,
      description: this.form.value.description,
      id: this.isNewProject ? undefined : this.selectedProject.id,
      active: this.form.value.active,
      valid_from: 0,
      valid_to: 0
    };

    this.project.save(payload, this.isNewProject).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewProject ? 'app.projects.detail.insert' : 'app.projects.detail.update';
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
