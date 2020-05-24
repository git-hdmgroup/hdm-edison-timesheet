import { NgModule } from '@angular/core';
import { ResponsiblesComponent } from './containers/responsibles/responsibles.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './responsibles.routes';
import { ResponsibleDetailComponent } from './components/responsible-detail/responsible-detail.component';

@NgModule({
  declarations: [ResponsiblesComponent, ResponsibleDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ResponsiblesModule { }
