import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Project } from 'src/app/_interfaces/entities/project';
import { ProjectService } from '../../../_services/project/project.service';
import { BupTableColumns } from '../../../shared/components/table/table.component';
import { MomentifyPipe } from '../../../shared/pipes/momentify/momentify.pipe';
import { DurationPipe } from '../../../shared/pipes/duration/duration.pipe';
import { ProjectView } from '../../../_interfaces/entities/project-view';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projectSubscription: Subscription;

  projects: ProjectView[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  columns: BupTableColumns[] = [
    {name: 'project_name', label: 'app.projects.description'},
    {name: 'cost_center_name', label: 'app.projects.cost_center_name'},
    {name: 'cost_asset', label: 'app.projects.cost_asset'},
    {name: 'typology', label: 'app.projects.typology'},
    {name: 'city', label: 'app.projects.city'},
    {name: 'active', label: 'app.projects.active'},
  ];

  constructor(private project: ProjectService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.projectSubscription = this.project.getAllView(true).subscribe((data) => {
      this.projects = data;
    });
  }

  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
  }

  openDetail(project: Project) {
    this.router.navigate([`/projects/${project.id}`]);
  }

  add() {
    this.router.navigate(['/projects/new']);
  }

  remove(project: Project) {
    this.project.deactivate(project).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.cost-centers.removed';
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
