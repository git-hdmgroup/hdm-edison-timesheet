import { NgModule } from '@angular/core';
import { CitiesComponent } from './containers/cities/cities.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './cities.routes';
import { CityDetailComponent } from './components/city-detail/city-detail.component';

@NgModule({
  declarations: [CitiesComponent, CityDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CitiesModule { }
