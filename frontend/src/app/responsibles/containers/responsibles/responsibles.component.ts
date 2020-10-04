import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { UserService } from '../../../_services/user/user.service';
import { Router } from '@angular/router';
import { ROLES, ROLES_IDX } from '../../../_constants/roles';
import { BupTableColumns } from '../../../shared/components/table/table.component';

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

  columns: BupTableColumns[] = [
    { name: 'name', label: 'app.users.name' },
    { name: 'surname', label: 'app.users.surname' },
    { name: 'email', label: 'app.users.email' },
  ];

  constructor(private user: UserService,
              private router: Router) { }

  ngOnInit(): void {

    this.isLoadingData = true;

    this.userSubscription = this.user.getAllByRole(ROLES[ROLES_IDX.RESPONSIBLE].role_id, true).subscribe((data) => {
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

    user.role = ROLES[ROLES_IDX.USER].role_id;

    this.user.save(user, false).toPromise().then((data) => {
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
