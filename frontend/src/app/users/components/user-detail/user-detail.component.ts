import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user/user.service';
import { AuthService } from '../../../_services/auth/auth.service';
import { ROLES } from '../../../_constants/roles';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  selectedUser: AppUser;
  roles = ROLES;
  isLoadingData = false;
  isNewUser = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', Validators.required],
    role: ['', Validators.required],
    ldap_id: ['', Validators.required],
    active: [null, Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private user: UserService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewUser = true;
      } else {
        this.userSubscription = this.user.getUser(Number(id), true).subscribe((data) => {
          this.selectedUser = data;
          this.form.setValue({
            name: this.selectedUser.name,
            surname: this.selectedUser.surname,
            email: this.selectedUser.email,
            ldap_id: this.selectedUser.ldap_id,
            active: this.selectedUser.active,
            role: this.selectedUser.role
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: AppUser = {
      surname: this.form.value.surname,
      name: this.form.value.name,
      email: this.form.value.email,
      id: this.isNewUser ? undefined : this.selectedUser.id,
      ldap_id: this.form.value.ldap_id,
      role: this.form.value.role,
      active: this.form.value.active
    };

    this.user.save(payload, this.isNewUser).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewUser ? 'app.users.detail.insert' : 'app.users.detail.update';
      this.alertVisible = true;

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }).catch((err) => {
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
