import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user/user.service';
import { AuthService } from '../../../_services/auth/auth.service';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  profileSubscription: Subscription;

  profile: AppUser;
  isLoadingData = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', Validators.required]
  });

  constructor(private user: UserService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    const currentUser = this.auth.getCurrentUser();
    this.profileSubscription = this.user.getUserByEmail(currentUser.email, true).subscribe((data) => {
      this.profile = data;
      this.form.setValue({
        name: this.profile.name,
        surname: this.profile.surname,
        email: this.profile.email
      });
    });
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: AppUser = {
      surname: this.form.value.surname,
      name: this.form.value.name,
      email: this.form.value.email,
      id: this.profile.id,
      ldap_id: this.profile.ldap_id,
      role: this.profile.role,
      active: this.profile.active,
      full_name: this.profile.full_name,
    };

    this.user.save(payload, false).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = 'app.user-profile.update';
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
