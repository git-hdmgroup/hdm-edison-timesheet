import { Component, Input, Optional, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, ControlContainer, FormGroup, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextInputComponent),
  multi: true,
};

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.sass'],
  providers: [VALUE_ACCESSOR]
})
export class TextInputComponent implements ControlValueAccessor {

  @Input()
  formControlName: string;

  @Input()
  label: string;

  @Input()
  placeholder = '';

  @Input()
  showValidation = true;

  @Input()
  isPassword = false;

  isDisabled: boolean;

  onModelChange;
  onTouch;

  value: string;

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
    this.value = obj;
  }

  handleFocus() {
    this.onTouch();
  }
}
