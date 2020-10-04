import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { City } from '../../_interfaces/entities/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private apollo: Apollo) {
  }

  getCity(id: number, isSubscription = false): Observable<City> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} city {
          cities(where: {id: {_eq: ${id}}}) {
            id city scope id_geo_area valid_from valid_to created_at updated_at
          }
        }
      `
      })
      .pipe(map(result => result.data.cities[0]));
  }

  getAll(isSubscription = false): Observable<City[]> {
    return this.apollo
      .subscribe<any>({
        query: gql`
        ${isSubscription ? 'subscription' : 'query'} city {
          cities {
            id city scope id_geo_area valid_from valid_to created_at updated_at
          }
        }
      `
      })
      .pipe(map(result => result.data.cities));
  }

  save(city: City, insert: boolean) {

    const updateQuery = gql`
      mutation city {
        update_cities(where: {id: {_eq: ${city.id}}}, _set: {
          city: "${city.city}",
          scope: "${city.scope}",
          id_geo_area: "${city.id_geo_area}",
          valid_from: ${city.valid_from},
          valid_to: ${city.valid_to},
          updated_at: ${Date.now()}
        }) {
          returning {
            id city scope id_geo_area valid_from valid_to created_at updated_at
          }
        }
      }`;

    const insertQuery = gql`
      mutation city {
        insert_cities(objects: {
          city: "${city.city}",
          scope: "${city.scope}",
          id_geo_area: "${city.id_geo_area}",
          valid_from: ${city.valid_from},
          valid_to: ${city.valid_to},
          updated_at: ${Date.now()},
          created_at: ${Date.now()}
        }) {
          returning {
            id city scope id_geo_area valid_from valid_to created_at updated_at
          }
        }
      }`;

    return this.apollo
      .mutate<any>({
        mutation: insert ? insertQuery : updateQuery
      })
      .pipe(map(result => insert ? result.data.insert_cities.returning[0] : result.data.update_cities.returning[0]));
  }

  deactivate(city: City) {
    city.active = 0;
    return this.save(city, false);
  }
}
