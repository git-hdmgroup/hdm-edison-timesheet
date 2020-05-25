import { NgModule } from '@angular/core';
import { PositionsComponent } from './containers/positions/positions.component';
import { PositionDetailComponent } from './components/position-detail/position-detail.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './positions.routes';

@NgModule({
  declarations: [PositionsComponent, PositionDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PositionsModule { }
