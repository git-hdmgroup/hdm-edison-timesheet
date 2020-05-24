import { Component, OnInit } from '@angular/core';
import { NAV_ITEMS } from 'src/app/_constants/nav-items';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  // TODO: filter by admin.
  navItems = NAV_ITEMS;

  constructor() { }

  ngOnInit(): void {
  }
}
