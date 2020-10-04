import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from '../../../_interfaces/entities/app-user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user/user.service';
import { AuthService } from '../../../_services/auth/auth.service';
import { ROLES } from '../../../_constants/roles';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PositionService } from '../../../_services/position/position.service';
import { Position } from '../../../_interfaces/entities/position';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  positionSubscription: Subscription;

  selectedUser: AppUser;
  positions: Position[] = [];
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
    cost_center_sender: ['', Validators.required],
    valid_from: ['', Validators.required],
    valid_to: ['', Validators.required],
    position: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private user: UserService,
              private position: PositionService,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      // Positions.
      this.positionSubscription = this.position.getAll(false).subscribe((data) => {
        this.positions = data;
      });

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
            cost_center_sender: this.selectedUser.cost_center_sender,
            valid_from: moment(this.selectedUser.valid_from).format('YYYY-MM-DD'),
            valid_to: moment(this.selectedUser.valid_to).format('YYYY-MM-DD'),
            position: this.selectedUser.id_position,
            role: this.selectedUser.role
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.positionSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: AppUser = {
      surname: this.form.value.surname,
      name: this.form.value.name,
      email: this.form.value.email,
      id: this.isNewUser ? undefined : this.selectedUser.id,
      role: this.form.value.role,
      id_position: this.form.value.position,
      cost_center_sender: this.form.value.cost_center_sender,
      valid_from: moment(this.form.value.valid_from, 'YYYY-MM-DD').utc().valueOf(),
      valid_to: moment(this.form.value.valid_to, 'YYYY-MM-DD').utc().valueOf()
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
