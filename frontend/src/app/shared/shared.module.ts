import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbDropdownModule,
  NgbButtonsModule,
  NgbNavModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from './components/card/card.component';
import { AlertComponent } from './components/alert/alert.component';
import { IsActivePipe } from './pipes/is-active/is-active.pipe';
import { SelectComponent } from './components/select/select.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CostCenterTypePipe } from './pipes/cost-center-type/cost-center-type.pipe';

const NG_BOOTSTRAP_MODULES = [
  NgbModalModule,
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbButtonsModule,
  NgbNavModule,
  NgbAlertModule,
];

@NgModule({
  declarations: [
    // Components.
    TextInputComponent,
    CardComponent,
    AlertComponent,
    SelectComponent,
    LoadingComponent,

    // Pipes.
    IsActivePipe,

    CostCenterTypePipe,
  ],
  imports: [
    CommonModule,
    ...NG_BOOTSTRAP_MODULES,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [

  ],
  exports: [
    CommonModule,
    ...NG_BOOTSTRAP_MODULES,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    // Components.
    TextInputComponent,
    CardComponent,
    AlertComponent,
    SelectComponent,
    LoadingComponent,

    // Pipes.
    IsActivePipe,
    CostCenterTypePipe,
  ]
})
export class SharedModule { }
