import { Routes } from '@angular/router';
import { ProjectsComponent } from './containers/projects/projects.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  }
];
