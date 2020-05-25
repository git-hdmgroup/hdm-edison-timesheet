import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Position } from '../../../_interfaces/entities/position';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PositionService } from '../../../_services/position/position.service';

@Component({
  selector: 'app-position-detail',
  templateUrl: './position-detail.component.html',
  styleUrls: ['./position-detail.component.sass']
})
export class PositionDetailComponent implements OnInit, OnDestroy {

  positionSubscription: Subscription;

  selectedPosition: Position;
  isLoadingData = false;
  isNewPosition = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    cost: ['', Validators.required],
    active: [null, Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private position: PositionService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewPosition = true;
      } else {
        this.positionSubscription = this.position.getPosition(Number(paramMap.get('id'))).subscribe((data) => {
          this.selectedPosition = data;

          this.form.setValue({
            name: this.selectedPosition.name,
            cost: this.selectedPosition.cost,
            active: this.selectedPosition.active
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.positionSubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      active: this.form.value.active,
      id: this.isNewPosition ? undefined : this.selectedPosition.id
    };

    this.position.save(payload, this.isNewPosition).toPromise().then((data) => {
      console.log(data);
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewPosition ? 'app.positions.detail.insert' : 'app.positions.detail.update';
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
