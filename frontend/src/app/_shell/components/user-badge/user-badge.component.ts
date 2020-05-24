import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../_services/auth/auth.service';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.sass']
})
export class UserBadgeComponent implements OnInit {

  profile: AppUser;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.profile = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
