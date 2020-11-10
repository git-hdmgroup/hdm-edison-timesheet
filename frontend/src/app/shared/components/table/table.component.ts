import { Component, OnInit, Input, Output, EventEmitter, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { faPencilAlt, faTrash, faPlusCircle, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { CsvDataService } from '../../../_services/commons/csv-data/csv-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FILTER_OPERATORS } from '../../../_constants/filter-commons';

export interface BupTableColumns {
  name: string;
  label: string;
  filterable?: boolean;
  type?: 'string' | 'number' | 'date';
  prefix?: string;
  suffix?: string;
  transform?: (param: any, ...args: any[]) => any;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit, OnChanges {

  @Input()
  data: any[];
  filteredData: any[];

  @Input()
  columns: BupTableColumns[];

  @Input()
  title: string;

  @Input()
  editButtonVisible = true;

  @Input()
  editButtonDisabled: boolean;

  @Input()
  removeButtonVisible = true;

  @Input()
  removeButtonDisabled: boolean;

  @Input()
  addButtonVisible = true;

  @Input()
  addButtonDisabled: boolean;

  @Input()
  exportButtonVisible = false;

  @Input()
  exportButtonDisabled: boolean;

  @Input()
  filterVisible = true;

  @Output()
  edit = new EventEmitter<any>();

  @Output()
  remove = new EventEmitter<any>();

  @Output()
  add = new EventEmitter<any>();

  iconPencil = faPencilAlt;
  iconTrash = faTrash;
  iconPlusCircle = faPlusCircle;
  iconExport = faFileExport;

  formGroup: FormGroup;

  constructor(private csvDataService: CsvDataService,
              private formBuilder: FormBuilder) {
  }

  private search(text: string): any[] {
    if (text && text.trim() === '') {
      return this.data;
    }

    return this.data.filter(data => {
      const term = text.toLowerCase();
      let found = false;

      this.columns.forEach((column) => {
        found = found || data[column.name].toString().toLowerCase().includes(term);
      });

      return found;
    });
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      filter: ''
    });

    this.formGroup.get('filter').valueChanges.subscribe((text) => {
      this.filteredData = this.search(text);
    });
  }

  handleEdit(item: any) {
    if (this.canEdit()) {
      this.edit.emit(item);
    }
  }

  handleRemove(item: any) {
    if (this.canRemove()) {
      this.remove.emit(item);
    }
  }

  handleAdd() {
    if (this.canAdd()) {
      this.add.emit(true);
    }
  }

  handleExport() {
    if (this.canExport()) {
      const fileName = `${Date.now()}-report-full.csv`;
      this.csvDataService.exportToCsv(fileName, this.data);
    }
  }

  private canEdit() {
    return !(!this.editButtonVisible || this.editButtonDisabled);
  }

  private canRemove() {
    return !(!this.removeButtonVisible || this.removeButtonDisabled);
  }

  private canAdd() {
    return !(!this.addButtonVisible || this.addButtonDisabled);
  }

  private canExport() {
    return this.exportButtonVisible && !this.addButtonDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && Array.isArray(changes.data.currentValue)) {
      this.filteredData = changes.data.currentValue;
    }
  }
}
