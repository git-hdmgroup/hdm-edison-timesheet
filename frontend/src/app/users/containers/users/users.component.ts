import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user/user.service';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BupTableColumns } from '../../../shared/components/table/table.component';
import { RolePipe } from '../../../shared/pipes/role/role.pipe';
import { commonColumns } from '../../../_constants/table-commons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  users: AppUser[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  columns: BupTableColumns[] = [
    {name: 'surname', label: 'app.users.surname'},
    {name: 'name', label: 'app.users.name'},
    {name: 'email', label: 'app.users.email'},
    {
      name: 'role',
      label: 'app.users.role',
      transform: (item): string => {
        const pipe = new RolePipe();
        return pipe.transform(item.role);
      }
    },
    {name: 'responsible_full_name', label: 'app.users.responsible_full_name'},
    ...commonColumns
  ];

  constructor(private user: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userSubscription = this.user.getAllView(true).subscribe((data) => {
      this.users = data;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  openDetail(user: AppUser) {
    this.router.navigate([`/users/${user.id}`]);
  }

  add() {
    this.router.navigate(['/users/new']);
  }

  remove(user: AppUser) {
    this.user.deactivate(user).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.users.removed';
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
