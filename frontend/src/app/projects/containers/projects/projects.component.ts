import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Project } from 'src/app/_interfaces/entities/project';
import { ProjectService } from '../../../_services/project/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projectSubscription: Subscription;

  projects: Project[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  constructor(private project: ProjectService,
              private router: Router) { }

  ngOnInit(): void {
    this.projectSubscription = this.project.getAll(true).subscribe((data) => {
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
