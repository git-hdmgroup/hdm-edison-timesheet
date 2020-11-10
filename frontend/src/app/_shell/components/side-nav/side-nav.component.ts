import { Component, OnInit } from '@angular/core';
import { NAV_ITEMS } from 'src/app/_constants/nav-items';
import { AuthService } from '../../../_services/auth/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  // TODO: filter by admin.
  navItems = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    this.navItems = NAV_ITEMS; // .filter(item => currentUser.role >= item.role);
  }
}
