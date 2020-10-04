import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faPencilAlt, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export interface BupTableColumns {
  name: string;
  label: string;
  prefix?: string;
  suffix?: string;
  transform?: (param: any, ...args: any[]) => any;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {

  @Input()
  data: any[];

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

  @Output()
  edit = new EventEmitter<any>();

  @Output()
  remove = new EventEmitter<any>();

  @Output()
  add = new EventEmitter<any>();

  iconPencil = faPencilAlt;
  iconTrash = faTrash;
  iconPlusCircle = faPlusCircle;

  constructor() {
  }

  ngOnInit(): void {
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

  private canEdit() {
    return !(!this.editButtonVisible || this.editButtonDisabled);
  }

  private canRemove() {
    return !(!this.removeButtonVisible || this.removeButtonDisabled);
  }

  private canAdd() {
    return !(!this.addButtonVisible || this.addButtonDisabled);
  }
}
