import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { City } from '../../../_interfaces/entities/city';
import { CityService } from '../../../_services/city/city.service';
import { BupTableColumns } from '../../../shared/components/table/table.component';
import { IsActivePipe } from '../../../shared/pipes/is-active/is-active.pipe';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.sass']
})
export class CitiesComponent implements OnInit, OnDestroy {

  citySubscription: Subscription;

  cities: City[] = [];
  alertVisible = false;
  alertType: string;
  alertMessage: string;

  columns: BupTableColumns[] = [
    { name: 'city', label: 'app.cities.city' },
    { name: 'id_geo_area', label: 'app.cities.id_geo_area' },
    { name: 'scope', label: 'app.cities.scope' }
  ];

  constructor(private city: CityService,
              private router: Router) { }

  ngOnInit(): void {
    this.citySubscription = this.city.getAll(true).subscribe((data) => {
      this.cities = data;
    });
  }

  ngOnDestroy(): void {
    this.citySubscription?.unsubscribe();
  }

  openDetail(city: City) {
    this.router.navigate([`/cities/${city.id}`]);
  }

  add() {
    this.router.navigate(['/cities/new']);
  }

  remove(city: City) {
    this.city.deactivate(city).toPromise().then((data) => {
      this.alertType = 'success';
      this.alertMessage = 'app.cities.removed';
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
