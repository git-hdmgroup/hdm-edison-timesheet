import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CityService } from '../../../_services/city/city.service';
import { Subscription } from 'rxjs';
import { City } from 'src/app/_interfaces/entities/city';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { booleanToNumber } from '../../../_utils/utils';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.sass']
})
export class CityDetailComponent implements OnInit, OnDestroy {

  citySubscription: Subscription;

  selectedCity: City;
  isLoadingData = false;
  isNewCity = false;

  alertVisible = false;
  alertType: string;
  alertMessage: string;

  form: FormGroup = this.formBuilder.group({
    city: ['', Validators.required],
    id_geo_area: ['', Validators.required],
    scope: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private city: CityService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {

      const id = paramMap.get('id');
      if (id === 'new') {
        this.isNewCity = true;
      } else {
        this.citySubscription = this.city.getCity(Number(paramMap.get('id'))).subscribe((data) => {
          this.selectedCity = data;

          this.form.setValue({
            city: this.selectedCity.city,
            id_geo_area: this.selectedCity.id_geo_area,
            scope: this.selectedCity.scope,
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.citySubscription?.unsubscribe();
  }

  submit() {
    this.isLoadingData = true;

    const payload: City = {
      city: this.form.value.city,
      id_geo_area: this.form.value.id_geo_area,
      scope: this.form.value.scope,
      id: this.isNewCity ? undefined : this.selectedCity.id,
      valid_from: 0,
      valid_to: 0
    };

    this.city.save(payload, this.isNewCity).toPromise().then((data) => {
      this.isLoadingData = false;
      this.alertType = 'success';
      this.alertMessage = this.isNewCity ? 'app.cities.insert' : 'app.cities.update';
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
