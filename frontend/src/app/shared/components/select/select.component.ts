import { Component, forwardRef, Input, Optional, Provider } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass'],
  providers: [VALUE_ACCESSOR]
})
export class SelectComponent implements ControlValueAccessor {

  @Input()
  formControlName: string;

  @Input()
  label: string;

  @Input()
  items: any[];

  @Input()
  translateText = false;

  @Input()
  showValidation = true;

  @Input()
  showNullOption = true;

  @Input()
  fieldKey = 'id';

  @Input()
  fieldValue = 'description';

  @Input()
  isLoading = false;

  @Input()
  useStringKey = false;

  isDisabled: boolean;

  onModelChange;
  onTouch;

  value: number | string | null;

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

  writeValue(value: number | string | null): void {
    this.value = value;
  }

  handleFocus() {
    this.onTouch();
  }

  handleChange(value) {
    if (this.useStringKey) {
      if (value === '') {
        this.onModelChange('');
      } else {
        this.onModelChange(value);
      }
    } else {
      if (value === 'null') {
        this.onModelChange(null);
      } else {
        this.onModelChange(+value);
      }
    }
  }
}
