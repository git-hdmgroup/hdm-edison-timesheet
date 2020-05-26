import { Component, forwardRef, Input, Optional, Provider } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BooleanInputComponent),
  multi: true,
};

@Component({
  selector: 'app-boolean-input',
  templateUrl: './boolean-input.component.html',
  styleUrls: ['./boolean-input.component.sass'],
  providers: [VALUE_ACCESSOR]
})
export class BooleanInputComponent implements ControlValueAccessor {

  @Input()
  formControlName: string;

  @Input()
  label: string;

  @Input()
  showValidation = true;

  @Input()
  color = 'primary';

  @Input()
  labelTrue = 'app.generic.yes';

  @Input()
  labelFalse = 'app.generic.no';

  onModelChange;
  onTouch;

  value: true | false | 1 | 0 | null;

  isDisabled = false;

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

  writeValue(obj: any): void {
    if (obj === null || obj === undefined) {
      this.value = null;
    } else if (obj === 1 || obj === '1' || obj === true) {
      this.value = true;
    } else if (obj === 0 || obj === '0' || obj === false) {
      this.value = false;
    }
  }

  handleFocus() {
    this.onTouch();
  }

}
