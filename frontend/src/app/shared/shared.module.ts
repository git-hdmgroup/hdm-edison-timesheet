import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbDropdownModule,
  NgbButtonsModule,
  NgbNavModule,
  NgbAlertModule
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
import { RolePipe } from './pipes/role/role.pipe';
import { MomentifyPipe } from './pipes/momentify/momentify.pipe';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DurationPipe } from './pipes/duration/duration.pipe';
import { TextareaComponent } from './components/textarea/textarea.component';
import { BooleanInputComponent } from './components/boolean-input/boolean-input.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { WeekCalendarComponent } from './components/week-calendar/week-calendar.component';
import { TableComponent } from './components/table/table.component';

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
    DatepickerComponent,
    TextareaComponent,
    BooleanInputComponent,
    CalendarComponent,
    WeekCalendarComponent,
    TableComponent,

    // Pipes.
    IsActivePipe,
    CostCenterTypePipe,
    RolePipe,
    MomentifyPipe,
    DurationPipe,
  ],
  imports: [
    CommonModule,
    ...NG_BOOTSTRAP_MODULES,
    FontAwesomeModule,
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
    FontAwesomeModule,
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
    DatepickerComponent,
    TextareaComponent,
    BooleanInputComponent,
    CalendarComponent,
    WeekCalendarComponent,
    TableComponent,

    // Pipes.
    IsActivePipe,
    CostCenterTypePipe,
    RolePipe,
    MomentifyPipe,
    DurationPipe,
  ]
})
export class SharedModule { }
