import { NgModule } from '@angular/core';
import { ProjectsComponent } from './containers/projects/projects.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './projects.routes';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProjectsModule { }
