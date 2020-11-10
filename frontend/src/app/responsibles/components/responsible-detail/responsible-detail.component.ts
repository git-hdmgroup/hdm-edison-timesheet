import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { UserService } from '../../../_services/user/user.service';
import { Router } from '@angular/router';
import { ROLES, ROLES_IDX } from '../../../_constants/roles';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-responsible-detail',
  templateUrl: './responsible-detail.component.html',
  styleUrls: ['./responsible-detail.component.sass']
})
export class ResponsibleDetailComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  isLoadingData = false;

  responsibles: AppUser[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup;

  constructor(private user: UserService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {

    this.isLoadingData = true;

    this.form = this.formBuilder.group({
      responsible_id: [null]
    });

    this.userSubscription = this.user.getAll( true).subscribe((data) => {
      this.responsibles = data.filter(item => item.role !== ROLES[ROLES_IDX.RESPONSIBLE].role_id);
      this.isLoadingData = false;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  submit() {
    const user = this.responsibles.find(item => item.id === this.form.value.responsible_id);
    user.role = ROLES[ROLES_IDX.RESPONSIBLE].role_id;

    this.isLoadingData = true;

    this.user.save(user, false).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = 'app.responsible.add';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch(() => {
      this.isLoadingData = false;
      this.alertType = 'danger';
      this.alertMessage = 'app.generic.error';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
