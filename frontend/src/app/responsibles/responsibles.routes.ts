import { Routes } from '@angular/router';
import { ResponsiblesComponent } from './containers/responsibles/responsibles.component';
import { ResponsibleDetailComponent } from './components/responsible-detail/responsible-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ResponsiblesComponent,
  },
  {
    path: 'edit',
    component: ResponsibleDetailComponent,
  }
];
