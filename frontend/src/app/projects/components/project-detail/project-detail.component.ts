import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_services/auth/auth.service';
import { Project } from 'src/app/_interfaces/entities/project';
import { ProjectService } from '../../../_services/project/project.service';
import * as moment from 'moment';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.sass']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  projectSubscription: Subscription;

  selectedProject: Project;
  isLoadingData = false;
  isNewProject = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    active: [null, Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private project: ProjectService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewProject = true;
      } else {
        this.projectSubscription = this.project.getProject(Number(id), true).subscribe((data) => {
          this.selectedProject = data;
          this.form.setValue({
            name: this.selectedProject.name,
            start_date: moment(this.selectedProject.start_date).format('YYYY-MM-DD'),
            end_date: moment(this.selectedProject.end_date).format('YYYY-MM-DD'),
            active: this.selectedProject.active
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: Project = {
      name: this.form.value.name,
      start_date: moment(this.form.value.start_date, 'YYYY-MM-DD').utc().valueOf(),
      end_date: moment(this.form.value.end_date, 'YYYY-MM-DD').utc().valueOf(),
      id: this.isNewProject ? undefined : this.selectedProject.id,
      active: this.form.value.active
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
