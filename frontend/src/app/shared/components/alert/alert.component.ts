import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent implements OnInit {

  @Input()
  dismissible: boolean;

  @Input()
  type: 'success' | 'info' | 'warning' | 'danger' ;

  @Input()
  message: string;

  constructor() { }

  ngOnInit(): void {
  }
}
