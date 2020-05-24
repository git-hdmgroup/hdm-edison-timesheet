import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { UserService } from '../../../_services/user/user.service';
import { Router } from '@angular/router';
import { ROLES } from '../../../_constants/roles';

@Component({
  selector: 'app-responsibles',
  templateUrl: './responsibles.component.html',
  styleUrls: ['./responsibles.component.sass']
})
export class ResponsiblesComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  isLoadingData = false;

  responsibles: AppUser[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  constructor(private user: UserService,
              private router: Router) { }

  ngOnInit(): void {

    this.isLoadingData = true;

    this.userSubscription = this.user.getAllByRole(ROLES.RESPONSIBLE, true).subscribe((data) => {
      this.responsibles = data;
      this.isLoadingData = false;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  add() {
    this.router.navigate([`/responsibles/edit`]);
  }

  removeUser(user: AppUser) {

    user.role = ROLES.USER;

    this.user.save(user).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.responsible.removed';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch(() => {
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
