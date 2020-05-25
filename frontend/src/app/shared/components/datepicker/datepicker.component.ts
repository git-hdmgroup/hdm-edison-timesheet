import { Component, forwardRef, Input, Optional, Provider } from '@angular/core';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/app/_constants/date-format';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true,
};

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.sass'],
  providers: [VALUE_ACCESSOR]
})
export class DatepickerComponent implements ControlValueAccessor {

  icon = faCalendarAlt;

  @Input()
  formControlName: string;

  @Input()
  label: string;

  @Input()
  placeholder = '';

  @Input()
  showValidation = true;

  @Input()
  format = DATE_FORMAT;

  @Input()
  color = 'primary';

  onModelChange;
  onTouch;

  isDisabled: boolean;
  isInvalidDate: boolean;

  value: NgbDateStruct | string | null;

  constructor(@Optional() private controlContainer: ControlContainer) {
  }

  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get control(): FormControl {
    return this.form.get(this.formControlName) as FormControl;
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.value = null;
      return;
    }

    const parsed = moment(value, this.format);
    this.isInvalidDate = !parsed.isValid();

    if (!this.isInvalidDate) {
      this.value = new NgbDate(parsed.year(), parsed.month() + 1, parsed.date());
    }
  }

  handleChange(value: NgbDateStruct | string | null) {
    if (value === null || value === undefined) {
      this.value = null;
      this.onModelChange(null);
      this.isInvalidDate = false;
      return;
    }

    if (typeof value === 'string') {
      this.value = value;
      this.onModelChange(value);
      this.isInvalidDate = true;
      return;
    }

    this.value = value;
    const date = moment(`${value.year}-${value.month}-${value.day}`, DATE_FORMAT);

    if (!date.isValid()) {
      this.isInvalidDate = true;
      return;
    }

    this.isInvalidDate = false;
    this.onModelChange(date.format(this.format));
  }

}
