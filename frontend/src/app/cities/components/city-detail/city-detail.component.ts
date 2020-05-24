import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CityService } from '../../../_services/city/city.service';
import { Subscription } from 'rxjs';
import { City } from 'src/app/_interfaces/entities/city';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    province_state: ['', Validators.required],
    zip_code: ['', Validators.required],
    nation: ['', Validators.required],
    active: [null, Validators.required]
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
            province_state: this.selectedCity.province_state,
            zip_code: this.selectedCity.zip_code,
            nation: this.selectedCity.nation,
            active: this.selectedCity.active
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
      nation: this.form.value.nation,
      zip_code: this.form.value.zip_code,
      province_state: this.form.value.province_state,
      city: this.form.value.city,
      active: this.form.value.active,
      id: this.isNewCity ? undefined : this.selectedCity.id
    };

    this.city.save(payload, this.isNewCity).toPromise().then((data) => {
      console.log(data);
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

      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    });
  }
}
